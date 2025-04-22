
// Behavior for the sheep: The farmer can move the sheep between the left and right sides of the river.
bthread("Sheep", function () {
    while (true) {
        // Request to move the sheep from the left to the right side
        request(bp.Event("RowTheBoat", { with: "Sheep", from: "L", to: "R" }));
        // Request to move the sheep from the right to the left side
        request(bp.Event("RowTheBoat", { with: "Sheep", from: "R", to: "L" }));
    }
});

// Behavior for the cabbage: The farmer can move the cabbage between the left and right sides of the river.
bthread("Cabbage", function () {
    while (true) {
        // Request to move the cabbage from the left to the right side
        request(bp.Event("RowTheBoat", { with: "Cabbage", from: "L", to: "R" }));
        // Request to move the cabbage from the right to the left side
        request(bp.Event("RowTheBoat", { with: "Cabbage", from: "R", to: "L" }));
    }
});

// Behavior for the wolf: The farmer can move the wolf between the left and right sides of the river.
bthread("Wolf", function () {
    while (true) {
        // Request to move the wolf from the left to the right side
        request(bp.Event("RowTheBoat", { with: "Wolf", from: "L", to: "R" }));
        // Request to move the wolf from the right to the left side
        request(bp.Event("RowTheBoat", { with: "Wolf", from: "R", to: "L" }));
    }
});

// Behavior for the farmer: The farmer can move alone between the left and right sides of the river.
bthread("Farmer", function () {
    while (true) {
        sync({ request: bp.Event("RowTheBoat", { with: "No one", from: "L", to: "R" }), 
               waitFor: Any({ from: "L", to: "R" }), 
               block: Any({ from: "R", to: "L" })
            });

        sync({ request: bp.Event("RowTheBoat", { with: "No one", from: "R", to: "L" }), 
               waitFor: Any({ from: "R", to: "L" }), 
               block: Any({ from: "L", to: "R" })
            });
    }
});

// Safety constraint: Prevent the wolf and sheep from being left alone on the same side.
bthread("WolfSheepSafety", function () {
    const WolfSheepEvents = Any({ with: "Wolf" }).or(Any({ with: "Sheep" })); // Events involving the wolf or sheep

    while (true) {
        // Ensure the wolf and sheep are not left alone by blocking invalid moves
        sync({ waitFor: WolfSheepEvents, block: WolfSheepEvents.negate() });
        // Wait for the farmer to move the wolf or sheep to the other side
        waitFor(WolfSheepEvents);
    }
});

// Safety constraint: Prevent the sheep and cabbage from being left alone on the same side.
bthread("SheepCabbageSafety", function () {
    const SheepCabbageEvents = Any({ with: "Sheep" }).or(Any({ with: "Cabbage" })); // Events involving the sheep or cabbage

    while (true) {
        // Ensure the sheep and cabbage are not left alone by blocking invalid moves
        sync({ waitFor: SheepCabbageEvents, block: SheepCabbageEvents.negate() });
        // Wait for the farmer to move the sheep or cabbage to the other side
        waitFor(SheepCabbageEvents);
    }
});

// Goal specification: Track the state of all entities and ensure the goal conditions are met.
bthread("Goal Specification", function () {
    state = { Sheep: "L", Wolf: "L", Cabbage: "L" }; // Initial state: all entities are on the left side

    while (true) {
        // Wait for any event and update the state based on the event
        let e = waitFor(EventSets.all);
        state[e.data.with] = e.data.to;

        // Log the current state for debugging purposes
        bp.log.info("Current state: " + JSON.stringify(state));

        // Assert that the wolf, sheep, and cabbage are not all on the right side simultaneously
        bp.ASSERT(
            state["Wolf"] != "R" || state["Sheep"] != "R" || state["Cabbage"] != "R",
            "The wolf, sheep and cabbage are not all on the right side of the river"
        );
    }
});
