Hooks.on('ready', () => {
    game.macros.getName('Enhanced Treat Wounds').execute = enhancedTreatWounds;
});

function enhancedTreatWounds() {
    // Check if a token is selected
    if (game.user.targets.size === 0) {
        ui.notifications.warn("No token selected!");
        return;
    }

    // Check if more than one token is selected
    if (game.user.targets.size > 1) {
        ui.notifications.warn("More than one token selected!");
        return;
    }

    // Get the selected token
    const selectedToken = game.user.targets.values().next().value;

    // Log the name of the selected token
    console.log(`Selected token: ${selectedToken.name}`);

    // Get player-owned tokens
    const playerOwnedTokens = game.actors.filter(actor => actor.hasPlayerOwner);

    // Display UI element with player-owned tokens and "other" option
    // This is a placeholder, you'll need to implement this UI
    displayTokenSelectionUI(playerOwnedTokens);

    // Wait for user to select another player or type a name
    // This is a placeholder, you'll need to implement this functionality
    const selectedOtherToken = await waitForTokenSelection();

    // Call the "Treat Wounds" macro
    const treatWoundsMacro = game.macros.getName("Treat Wounds");
    treatWoundsMacro.execute();

    // Wait for user to click the "treat wounds" button
    // This is a placeholder, you'll need to implement this functionality
    await waitForTreatWounds();

    // Post a message to the chat
    ChatMessage.create({
        user: game.user._id,
        content: `${game.user.name} attempts to heal ${selectedOtherToken.name}`
    });
}

function displayTokenSelectionUI(playerOwnedTokens) {
    // Implement this function to display a UI element with the player-owned tokens and an "other" option
}

function waitForTokenSelection() {
    // Implement this function to wait for the user to select another player or type a name
}

function waitForTreatWounds() {
    // Implement this function to wait for the user to click the "treat wounds" button
}

module.exports = {
  enhancedTreatWounds
};
