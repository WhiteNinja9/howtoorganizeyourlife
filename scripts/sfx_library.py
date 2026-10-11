"""Which Mixkit takes play for each cue kind (ids → titles for reference)."""
LIB = {
    "key": [2541, 2542],  # + keystrokes sliced from the typing sequences below
    "click": [1113, 2997, 1116, 2579],
    "tick": [1128, 1127, 2580, 1124],
    "pop": [2358, 2364, 1124, 2057],
    "whoosh": [2605, 168, 2607, 2625, 2627, 164, 1462],
    "air": [2604, 1489, 167, 163, 166, 2608, 2625, 2607],
    "swish": [2637, 3115, 174, 2384],
    "thud": [1143, 772, 757, 2161],
    "soft": [2161, 2057, 2144],
    "paper": [1104, 1101, 1530, 2386, 2380],
    "shimmer": [1494],
}
TYPING_SEQUENCES = [2536, 2537]
TITLES = {
    2541: "Single key press in a laptop", 2542: "Hard single key press in a laptop",
    2536: "Writing on a laptop keyboard", 2537: "Laptop keyboard typing sequence",
    1113: "Mouse click close", 2997: "Clear mouse clicks", 1116: "Single classic click", 2579: "Light switch sound",
    1128: "Pebbles click", 1127: "Interface click hover", 2580: "Light button", 1124: "Plastic bubble click",
    2358: "Long pop", 2364: "Hard pop click", 2057: "Blow breaking the air",
    2605: "Quick air woosh", 168: "Fast air sweep transition", 2607: "Fast air woosh", 2625: "Fast air zoom",
    2627: "Fast swipe zoom", 164: "Fast sweeping transition", 1462: "Quick swoosh",
    2604: "Deep air woosh", 1489: "Air woosh", 167: "Long sweeping air swoosh", 163: "Slow sweeping swoosh",
    166: "Fast small sweep transition", 2608: "Air zoom vacuum",
    2637: "Fast air transition sweep", 3115: "Fast transitions swoosh", 174: "Fast sweep transition", 2384: "Paper quick slice",
    1143: "Cinematic whoosh deep impact", 772: "Quick zoom impact", 757: "Falling hit", 2161: "Air in a hit",
    2144: "Fast blow", 1104: "Page turn single", 1101: "Single book paging", 1530: "Paper slide",
    2386: "Pages of paper moving", 2380: "Paper quick movement", 1494: "Sand swish",
}
ALL_IDS = sorted({i for v in LIB.values() for i in v} | set(TYPING_SEQUENCES))
