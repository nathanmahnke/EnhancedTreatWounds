Hooks.on('init', () => {
  console.log("Hello");
  game.keybindings.register("cinematicCamera", "Test", {
    name: "Center TV view on players",
    hint: "Resizes the view of the player \"TV\" to insure all players are on screen",
    editable: [
      {
        key: "KeyZ"
      }
    ],
    onDown: () => {
      zoomToFitAllVisiblePlayers();
      console.log("Z has been pressed");
      return true;
    },
  });

  // Register the combat turn event
  Hooks.on('preUpdateCombat', (combat, updateData) => {
    if (combat && combat.turns && combat.turns.length > 0) {
      const currentTurn = combat.turns[updateData.turn];
      const activeCreature = currentTurn.actor; // Assuming you're using the default combat system

      const tvPlayer = game.users.find((u) => u.name === 'TV');
      if (tvPlayer && (activeCreature.hasPlayerOwner(tvPlayer) || activeCreature.hasPerm('OBSERVER'))) {
        followActiveCreatureWithCamera(activeCreature);
      }
    }
  });

  // Call zoomToFitAllVisiblePlayers() when a player's turn ends in combat
  Hooks.on('updateCombat', (combat, changed) => {
    if (combat && changed && 'turn' in changed) {
      const turnData = combat.turns[changed.turn];
      const actorId = turnData?.actor?._id;
      const tvPlayer = game.users.find((u) => u.name === 'TV');

      if (tvPlayer && actorId && game.actors && game.actors.get(actorId)?.hasPlayerOwner(tvPlayer)) {
        zoomToFitAllVisiblePlayers();
      }
    }
  });
});

// Encapsulated method to zoom in/out to fit all visible player-owned creatures in the scene
function zoomToFitAllVisiblePlayers() {
  const visibleTokens = canvas.tokens.placeables.filter((token) => token.visible && (token.actor.isOwner || token.actor.hasPerm('OBSERVER')));

  if (visibleTokens.length > 0) {
    const xCoords = visibleTokens.map((token) => token.x);
    const yCoords = visibleTokens.map((token) => token.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const width = maxX - minX;
    const height = maxY - minY;

    const sceneWidth = canvas.scene.data.width;
    const sceneHeight = canvas.scene.data.height;

    const scaleFactor = Math.min(sceneWidth / width, sceneHeight / height);
    const targetScale = Math.min(scaleFactor, 1.0); // Set an upper limit to avoid zooming too close

    canvas.animatePan({ x: (minX + maxX) / 2, y: (minY + maxY) / 2, scale: targetScale });
  }
}

// Encapsulated method to follow the active creature with the camera
function followActiveCreatureWithCamera(activeCreature) {
  canvas.tokens.placeables.forEach((token) => {
    if (token.actor === activeCreature) {
      canvas.animatePan({ x: token.x, y: token.y, scale: 1.0 });
    }
  });
}
