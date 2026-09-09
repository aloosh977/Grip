// Built-in default exercise library. This is shipped with the app and is
// merged into a user's library on load (missing entries only), so shipping an
// updated catalog never touches custom user exercises.
//
// Each entry gets a stable `id` (derived from its name), a fixed `created_at`,
// `image_url: ''` (the app shows a default icon), and `is_default: true`.

export const DEFAULT_EXERCISES = [
	{
		name: 'Barbell Bench Press',
		description: 'Lie flat on a bench, lower the barbell to your mid-chest, and push it up until arms are extended.',
		tool: 'barbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Triceps', 'Front Delts']
	},
	{
		name: 'Incline Dumbbell Press',
		description: 'Lie on an incline bench and press dumbbells upward to target the upper chest region.',
		tool: 'dumbbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Front Delts', 'Triceps']
	},
	{
		name: 'Chest Fly Machine',
		description: 'Sit tall and sweep your arms forward in an arc to isolate the pectoral muscles.',
		tool: 'machine',
		muscle_primary: 'Chest',
		muscles_secondary: ['Front Delts']
	},
	{
		name: 'Cable Crossover',
		description: 'Stand between opposing pulleys and pull cables downward and inward to squeeze the chest.',
		tool: 'cable',
		muscle_primary: 'Chest',
		muscles_secondary: ['Front Delts']
	},
	{
		name: 'Push-Up',
		description: 'Support your weight on hands and toes, lower your body to the floor, and push back up.',
		tool: 'bodyweight',
		muscle_primary: 'Chest',
		muscles_secondary: ['Triceps', 'Front Delts', 'Core']
	},
	{
		name: 'Decline Barbell Press',
		description: 'Lie on a decline bench and press a barbell upward to emphasize the lower chest fibers.',
		tool: 'barbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Triceps', 'Front Delts']
	},
	{
		name: 'Dumbbell Bench Press',
		description: 'Lie flat on a bench and press dumbbells upward, allowing for a deeper stretch at the bottom.',
		tool: 'dumbbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Triceps', 'Front Delts']
	},
	{
		name: 'Incline Barbell Press',
		description: 'Press a barbell upward from an inclined bench to isolate and build the upper chest.',
		tool: 'barbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Front Delts', 'Triceps']
	},
	{
		name: 'Dumbbell Chest Fly',
		description: 'Lie flat on a bench and lower dumbbells out to your sides in a wide arc, keeping elbows slightly bent.',
		tool: 'dumbbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Front Delts']
	},
	{
		name: 'Chest Press Machine',
		description: 'Sit upright and push the handles away from your chest using a guided machine track.',
		tool: 'machine',
		muscle_primary: 'Chest',
		muscles_secondary: ['Triceps', 'Front Delts']
	},
	{
		name: 'Low-to-High Cable Fly',
		description: 'Pull cables from a low position upward and inward to target the upper chest fibers.',
		tool: 'cable',
		muscle_primary: 'Chest',
		muscles_secondary: ['Front Delts']
	},
	{
		name: 'Decline Dumbbell Press',
		description: 'Lie on a decline bench and press dumbbells vertically to target the lower chest.',
		tool: 'dumbbell',
		muscle_primary: 'Chest',
		muscles_secondary: ['Triceps', 'Front Delts']
	},
	{
		name: 'Barbell Back Squat',
		description: 'Rest a barbell across your upper back, drop your hips low, and stand back up.',
		tool: 'barbell',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings', 'Core']
	},
	{
		name: 'Leg Press Machine',
		description: 'Sit in the sled, place feet on the platform, and extend legs against the resistance.',
		tool: 'machine',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Dumbbell Bulgarian Split Squat',
		description: 'Elevate one foot behind you on a bench and lower your hips using the front leg.',
		tool: 'dumbbell',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Leg Extension Machine',
		description: 'Sit back and extend your legs forward against the padded roller to isolate the thighs.',
		tool: 'machine',
		muscle_primary: 'Quads',
		muscles_secondary: []
	},
	{
		name: 'Barbell Front Squat',
		description: 'Rest the barbell on the front of your shoulders and squat deeply, keeping your torso upright.',
		tool: 'barbell',
		muscle_primary: 'Quads',
		muscles_secondary: ['Core', 'Glutes', 'Upper Back']
	},
	{
		name: 'Hack Squat Machine',
		description: 'Place shoulders against pads on an angled sled and lower your body into a deep squat.',
		tool: 'machine',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Dumbbell Goblet Squat',
		description: 'Hold a single dumbbell vertically against your chest and perform a deep squat.',
		tool: 'dumbbell',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Core', 'Hamstrings']
	},
	{
		name: 'Dumbbell Walking Lunge',
		description: 'Step forward with dumbbells at your sides and lower your hips until your back knee nears the floor.',
		tool: 'dumbbell',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Bodyweight Air Squat',
		description: 'Squat down until thighs are parallel to the ground using only your body weight.',
		tool: 'bodyweight',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Smith Machine Squat',
		description: 'Squat down using a barbell fixed within vertical steel guide rails.',
		tool: 'machine',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Barbell Conventional Deadlift',
		description: 'Hinge at your hips to lift a loaded barbell from the floor up to a standing lockout.',
		tool: 'barbell',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Glutes', 'Lower Back', 'Forearms', 'Traps']
	},
	{
		name: 'Barbell Romanian Deadlift',
		description: 'Hinge at the hips with a slight knee bend, lowering the bar along your shins to stretch the hamstrings.',
		tool: 'barbell',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Glutes', 'Lower Back']
	},
	{
		name: 'Seated Leg Curl Machine',
		description: 'Pull the padded lever down toward the back of your thighs while seated to isolate the hamstrings.',
		tool: 'machine',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Calves']
	},
	{
		name: 'Lying Leg Curl Machine',
		description: 'Lie face down and curl the padded lever upward toward your glutes to isolate the hamstrings.',
		tool: 'machine',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Calves']
	},
	{
		name: 'Dumbbell Romanian Deadlift',
		description: 'Perform a hip hinge holding dumbbells close to your legs to target the rear thigh.',
		tool: 'dumbbell',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Glutes', 'Lower Back']
	},
	{
		name: 'Glute Ham Raise',
		description: 'Lock your ankles into a specialized bench and lower your torso forward, using hamstrings to pull back up.',
		tool: 'bodyweight',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Glutes', 'Lower Back']
	},
	{
		name: 'Barbell Sumo Deadlift',
		description: 'Lift a barbell with a very wide stance and hands placed inside your knees.',
		tool: 'barbell',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Glutes', 'Adductors', 'Lower Back']
	},
	{
		name: 'Barbell Hip Thrust',
		description: 'Place upper back on a bench, sit behind a loaded bar, and drive hips upward.',
		tool: 'barbell',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Hamstrings']
	},
	{
		name: 'Cable Pull-Through',
		description: 'Stand facing away from a low pulley, hold the rope between your legs, and hinge forward and back.',
		tool: 'cable',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Hamstrings', 'Lower Back']
	},
	{
		name: 'Glute Kickback Machine',
		description: 'Push a padded platform backward with one foot to isolate the gluteal muscles.',
		tool: 'machine',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Hamstrings']
	},
	{
		name: 'Cable Glute Kickback',
		description: 'Attach a cuff to your ankle and kick your leg straight back against cable tension.',
		tool: 'cable',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Hamstrings']
	},
	{
		name: 'Hip Abduction Machine',
		description: 'Sit and push your thighs outward against pads to target the outer glutes.',
		tool: 'machine',
		muscle_primary: 'Glutes',
		muscles_secondary: []
	},
	{
		name: 'Seated Calf Raise Machine',
		description: 'Push up through the balls of your feet against a padded knee lever.',
		tool: 'machine',
		muscle_primary: 'Calves',
		muscles_secondary: []
	},
	{
		name: 'Standing Calf Raise Machine',
		description: 'Place shoulders under pads and extend your ankles upward to target the calves.',
		tool: 'machine',
		muscle_primary: 'Calves',
		muscles_secondary: []
	},
	{
		name: 'Dumbbell Standing Calf Raise',
		description: 'Hold dumbbells at your sides and rise onto your tiptoes on a flat surface or ledge.',
		tool: 'dumbbell',
		muscle_primary: 'Calves',
		muscles_secondary: []
	},
	{
		name: 'Lat Pulldown Machine',
		description: 'Pull the wide overhead bar down to your upper chest while driving your elbows downward.',
		tool: 'machine',
		muscle_primary: 'Lats',
		muscles_secondary: ['Biceps', 'Upper Back', 'Rear Delts']
	},
	{
		name: 'Barbell Bent Over Row',
		description: 'Hinge forward and pull the barbell up to your lower ribs while keeping your spine straight.',
		tool: 'barbell',
		muscle_primary: 'Upper Back',
		muscles_secondary: ['Lats', 'Biceps', 'Rear Delts']
	},
	{
		name: 'Seated Cable Row',
		description: 'Sit at the pulley system, pull the attachment toward your torso, and squeeze your shoulder blades.',
		tool: 'cable',
		muscle_primary: 'Upper Back',
		muscles_secondary: ['Lats', 'Biceps']
	},
	{
		name: 'Pull-Up',
		description: 'Hang from an overhead bar with palms facing away and pull your chest up to the bar.',
		tool: 'bodyweight',
		muscle_primary: 'Lats',
		muscles_secondary: ['Biceps', 'Upper Back']
	},
	{
		name: 'Chin-Up',
		description: 'Hang with palms facing toward you and pull yourself up to engage more biceps.',
		tool: 'bodyweight',
		muscle_primary: 'Lats',
		muscles_secondary: ['Biceps']
	},
	{
		name: 'Dumbbell Single Arm Row',
		description: 'Support your knee and hand on a bench and pull a dumbbell up to your hip.',
		tool: 'dumbbell',
		muscle_primary: 'Lats',
		muscles_secondary: ['Upper Back', 'Biceps']
	},
	{
		name: 'T-Bar Row Machine',
		description: 'Straddle the T-bar platform and pull the handles up toward your chest.',
		tool: 'machine',
		muscle_primary: 'Upper Back',
		muscles_secondary: ['Lats', 'Biceps']
	},
	{
		name: 'Chest Supported Dumbbell Row',
		description: 'Lie face down on an incline bench and pull dumbbells upward to eliminate momentum.',
		tool: 'dumbbell',
		muscle_primary: 'Upper Back',
		muscles_secondary: ['Lats', 'Biceps']
	},
	{
		name: 'Straight Arm Cable Pulldown',
		description: 'Keep arms locked straight and sweep a high cable pulley down to your thighs to isolate lats.',
		tool: 'cable',
		muscle_primary: 'Lats',
		muscles_secondary: ['Triceps']
	},
	{
		name: 'Close Grip Lat Pulldown',
		description: 'Attach a V-bar to the pulldown station and pull to your chest to focus on lower lats.',
		tool: 'machine',
		muscle_primary: 'Lats',
		muscles_secondary: ['Biceps', 'Upper Back']
	},
	{
		name: 'Dumbbell Pullover',
		description: 'Lie across a bench and lower a single dumbbell backward over your head, then pull it back up.',
		tool: 'dumbbell',
		muscle_primary: 'Lats',
		muscles_secondary: ['Chest', 'Triceps']
	},
	{
		name: 'Inverted Row',
		description: 'Hang underneath a low bar fixed in a rack and pull your chest up to the bar.',
		tool: 'bodyweight',
		muscle_primary: 'Upper Back',
		muscles_secondary: ['Lats', 'Biceps']
	},
	{
		name: 'Barbell Rack Pull',
		description: 'Set a barbell on pins at knee height and pull the weight to a standing lockout position.',
		tool: 'barbell',
		muscle_primary: 'Lower Back',
		muscles_secondary: ['Traps', 'Glutes', 'Hamstrings', 'Forearms']
	},
	{
		name: 'Hyperextension Machine',
		description: 'Lock into a 45-degree bench and lower your torso forward, then use your spine to lift back up.',
		tool: 'machine',
		muscle_primary: 'Lower Back',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Barbell Overhead Press',
		description: 'Press a barbell vertically from your upper chest to a full lockout over your head.',
		tool: 'barbell',
		muscle_primary: 'Front Delts',
		muscles_secondary: ['Triceps', 'Side Delts', 'Upper Back']
	},
	{
		name: 'Dumbbell Lateral Raise',
		description: 'Raise dumbbells out to your sides up to shoulder height to build shoulder width.',
		tool: 'dumbbell',
		muscle_primary: 'Side Delts',
		muscles_secondary: ['Front Delts', 'Traps']
	},
	{
		name: 'Cable Lateral Raise',
		description: 'Pull a low cable across your body out to the side for continuous shoulder tension.',
		tool: 'cable',
		muscle_primary: 'Side Delts',
		muscles_secondary: ['Traps']
	},
	{
		name: 'Dumbbell Rear Delt Fly',
		description: 'Hinge forward at the hips and raise dumbbells out to the sides to target the rear shoulders.',
		tool: 'dumbbell',
		muscle_primary: 'Rear Delts',
		muscles_secondary: ['Upper Back']
	},
	{
		name: 'Face Pull',
		description: 'Pull a high cable rope attachment toward your forehead while flaring your elbows.',
		tool: 'cable',
		muscle_primary: 'Rear Delts',
		muscles_secondary: ['Upper Back', 'Traps']
	},
	{
		name: 'Seated Dumbbell Shoulder Press',
		description: 'Sit upright and press dumbbells from shoulder level to fully extended overhead.',
		tool: 'dumbbell',
		muscle_primary: 'Front Delts',
		muscles_secondary: ['Triceps', 'Side Delts']
	},
	{
		name: 'Barbell Push Press',
		description: 'Use a slight leg dip to drive a heavy barbell overhead from your shoulders.',
		tool: 'barbell',
		muscle_primary: 'Front Delts',
		muscles_secondary: ['Triceps', 'Quads', 'Side Delts']
	},
	{
		name: 'Shoulder Press Machine',
		description: 'Sit in a guided machine frame and push handles vertically overhead.',
		tool: 'machine',
		muscle_primary: 'Front Delts',
		muscles_secondary: ['Triceps']
	},
	{
		name: 'Dumbbell Front Raise',
		description: 'Raise dumbbells straight out in front of you up to eye level.',
		tool: 'dumbbell',
		muscle_primary: 'Front Delts',
		muscles_secondary: ['Side Delts']
	},
	{
		name: 'Machine Lateral Raise',
		description: 'Sit and push your outer arms against padded levers upward to isolate the lateral shoulders.',
		tool: 'machine',
		muscle_primary: 'Side Delts',
		muscles_secondary: []
	},
	{
		name: 'Reverse Pec Deck Machine',
		description: 'Sit facing the pad and sweep your arms backward to isolate the rear delts.',
		tool: 'machine',
		muscle_primary: 'Rear Delts',
		muscles_secondary: ['Upper Back']
	},
	{
		name: 'Barbell Upright Row',
		description: 'Pull a barbell vertically up your chest, flaring your elbows high.',
		tool: 'barbell',
		muscle_primary: 'Side Delts',
		muscles_secondary: ['Traps', 'Front Delts']
	},
	{
		name: 'Barbell Shrug',
		description: 'Hold a barbell and shrug your shoulders straight up toward your ears to target the upper neck.',
		tool: 'barbell',
		muscle_primary: 'Traps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Dumbbell Shrug',
		description: 'Hold dumbbells at your sides and lift your shoulders up toward your ears.',
		tool: 'dumbbell',
		muscle_primary: 'Traps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Dumbbell Biceps Curl',
		description: 'Stand holding dumbbells at your sides and curl the weights up while rotating your palms up.',
		tool: 'dumbbell',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Barbell Preacher Curl',
		description: 'Rest your upper arms on an angled pad and curl a barbell up to isolate the biceps.',
		tool: 'barbell',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Dumbbell Hammer Curl',
		description: 'Curl dumbbells while keeping your palms facing each other to build arm thickness.',
		tool: 'dumbbell',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms', 'Brachialis']
	},
	{
		name: 'Barbell Biceps Curl',
		description: 'Stand straight and curl a loaded barbell up toward your shoulders.',
		tool: 'barbell',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Cable Biceps Curl',
		description: 'Curl a low pulley bar attachment toward your chest for constant tension.',
		tool: 'cable',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Dumbbell Incline Biceps Curl',
		description: 'Sit on an incline bench with arms hanging straight down and curl the weights up.',
		tool: 'dumbbell',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Dumbbell Concentration Curl',
		description: 'Sit on a bench, brace your elbow against your inner thigh, and curl a single dumbbell.',
		tool: 'dumbbell',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Biceps Curl Machine',
		description: 'Sit at a padded station and pull the mechanical handles upward to isolate the biceps.',
		tool: 'machine',
		muscle_primary: 'Biceps',
		muscles_secondary: []
	},
	{
		name: 'Cable Rope Hammer Curl',
		description: 'Curl a low cable rope attachment while maintaining a neutral palms-facing grip.',
		tool: 'cable',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms', 'Brachialis']
	},
	{
		name: 'Barbell Reverse Curl',
		description: 'Curl a barbell using an overhand grip to heavily target the forearms and outer arm.',
		tool: 'barbell',
		muscle_primary: 'Forearms',
		muscles_secondary: ['Biceps']
	},
	{
		name: 'Barbell Wrist Curl',
		description: 'Rest forearms on a bench holding a barbell overhand or underhand, and flex your wrists.',
		tool: 'barbell',
		muscle_primary: 'Forearms',
		muscles_secondary: []
	},
	{
		name: 'Cable Triceps Pushdown',
		description: 'Push a high cable attachment downward by locking out your elbows at your sides.',
		tool: 'cable',
		muscle_primary: 'Triceps',
		muscles_secondary: []
	},
	{
		name: 'Dumbbell Overhead Triceps Extension',
		description: 'Hold a dumbbell overhead with both hands, lower it behind your neck, and push back up.',
		tool: 'dumbbell',
		muscle_primary: 'Triceps',
		muscles_secondary: []
	},
	{
		name: 'Triceps Dip',
		description: 'Suspend your body on parallel bars, lower your torso, and push up using your arms.',
		tool: 'bodyweight',
		muscle_primary: 'Triceps',
		muscles_secondary: ['Chest', 'Front Delts']
	},
	{
		name: 'Barbell Skull Crusher',
		description: 'Lie on a flat bench and lower an EZ-bar down toward your forehead by bending the elbows.',
		tool: 'barbell',
		muscle_primary: 'Triceps',
		muscles_secondary: []
	},
	{
		name: 'Close Grip Barbell Bench Press',
		description: 'Perform a bench press with hands positioned shoulder-width apart to emphasize the triceps.',
		tool: 'barbell',
		muscle_primary: 'Triceps',
		muscles_secondary: ['Chest', 'Front Delts']
	},
	{
		name: 'Cable Overhead Triceps Extension',
		description: 'Face away from a high pulley, pull a rope attachment from behind your head straight forward.',
		tool: 'cable',
		muscle_primary: 'Triceps',
		muscles_secondary: []
	},
	{
		name: 'Dumbbell Triceps Kickback',
		description: 'Hinge forward, pin your elbow to your side, and extend a dumbbell straight backward.',
		tool: 'dumbbell',
		muscle_primary: 'Triceps',
		muscles_secondary: []
	},
	{
		name: 'Bench Dip',
		description: 'Place hands behind you on a bench, feet on the floor, and lower your hips by bending your arms.',
		tool: 'bodyweight',
		muscle_primary: 'Triceps',
		muscles_secondary: ['Chest', 'Front Delts']
	},
	{
		name: 'Triceps Extension Machine',
		description: 'Sit in a dedicated seat and push padded mechanical levers downward to isolate the triceps.',
		tool: 'machine',
		muscle_primary: 'Triceps',
		muscles_secondary: []
	},
	{
		name: 'Diamond Push-Up',
		description: 'Perform a push-up with your thumbs and index fingers touching to heavily stress the triceps.',
		tool: 'bodyweight',
		muscle_primary: 'Triceps',
		muscles_secondary: ['Chest', 'Front Delts']
	},
	{
		name: 'Hanging Knee Raise',
		description: 'Hang from a bar and pull your knees up toward your chest to engage the lower abs.',
		tool: 'bodyweight',
		muscle_primary: 'Abs',
		muscles_secondary: ['Hip Flexors']
	},
	{
		name: 'Ab Wheel Rollout',
		description: 'Kneel on the floor and roll an ab wheel forward, stretching out your core before pulling back.',
		tool: 'other',
		muscle_primary: 'Abs',
		muscles_secondary: ['Lats', 'Lower Back']
	},
	{
		name: 'Cable Crunch',
		description: 'Kneel beneath a high pulley, hold the rope attachment by your head, and crunch down.',
		tool: 'cable',
		muscle_primary: 'Abs',
		muscles_secondary: []
	},
	{
		name: 'Plank',
		description: 'Hold a push-up position on your forearms, keeping your body in a rigid straight line.',
		tool: 'bodyweight',
		muscle_primary: 'Core',
		muscles_secondary: ['Abs', 'Lower Back', 'Shoulders']
	},
	{
		name: 'Decline Crunch',
		description: 'Hook your feet into a decline bench and perform targeted torso crunches.',
		tool: 'bodyweight',
		muscle_primary: 'Abs',
		muscles_secondary: []
	},
	{
		name: "Captain's Chair Leg Raise",
		description: 'Rest your forearms on the tower pads and lift your straight legs parallel to the floor.',
		tool: 'bodyweight',
		muscle_primary: 'Abs',
		muscles_secondary: ['Hip Flexors']
	},
	{
		name: 'Bicycle Crunch',
		description: 'Lie flat on your back and alternate touching your elbows to opposite knees.',
		tool: 'bodyweight',
		muscle_primary: 'Abs',
		muscles_secondary: ['Obliques']
	},
	{
		name: 'Russian Twist',
		description: 'Sit with knees bent, feet slightly off the floor, and twist your torso from side to side.',
		tool: 'bodyweight',
		muscle_primary: 'Obliques',
		muscles_secondary: ['Abs']
	},
	{
		name: 'Side Plank',
		description: 'Prop your body up sideways on a single forearm to build lateral core stability.',
		tool: 'bodyweight',
		muscle_primary: 'Obliques',
		muscles_secondary: ['Core', 'Shoulders']
	},
	{
		name: 'Cable Woodchopper',
		description: 'Pull a cable attachment diagonally across your body in a twisting motion.',
		tool: 'cable',
		muscle_primary: 'Obliques',
		muscles_secondary: ['Abs', 'Shoulders']
	},
	{
		name: 'Band Crab Walk',
		description: 'Place a resistance band around your knees or ankles and take step-by-step lateral strides.',
		tool: 'bands',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Thighs']
	},
	{
		name: 'Band Biceps Curl',
		description: 'Step onto a loop resistance band and curl the handles up toward your shoulders.',
		tool: 'bands',
		muscle_primary: 'Biceps',
		muscles_secondary: ['Forearms']
	},
	{
		name: 'Band Pull-Apart',
		description: 'Hold a band straight out in front of you and pull your hands apart horizontally to hit the rear shoulders.',
		tool: 'bands',
		muscle_primary: 'Rear Delts',
		muscles_secondary: ['Upper Back']
	},
	{
		name: "Dumbbell Farmer's Walk",
		description: 'Pick up two heavy dumbbells and walk forward for distance to test grip and structural stability.',
		tool: 'dumbbell',
		muscle_primary: 'Forearms',
		muscles_secondary: ['Core', 'Traps', 'Legs']
	},
	{
		name: 'Kettlebell Swing',
		description: 'Hinge at the hips and swing a kettlebell up to chest height, driving with the glutes and hamstrings.',
		tool: 'other',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Hamstrings', 'Core', 'Lower Back']
	},
	{
		name: 'Dumbbell Step-Up',
		description: 'Step onto a sturdy platform with one leg holding dumbbells and drive up to full extension.',
		tool: 'dumbbell',
		muscle_primary: 'Quads',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Trap Bar Deadlift',
		description: 'Stand inside a trap bar and hinge up to a standing lockout, keeping your chest tall.',
		tool: 'other',
		muscle_primary: 'Hamstrings',
		muscles_secondary: ['Glutes', 'Lower Back', 'Traps', 'Forearms']
	},
	{
		name: 'Back Extension',
		description: 'Lock into a hyperextension bench and raise your torso until your body forms a straight line.',
		tool: 'machine',
		muscle_primary: 'Lower Back',
		muscles_secondary: ['Glutes', 'Hamstrings']
	},
	{
		name: 'Arnold Press',
		description: 'Start with dumbbells at your shoulders, palms facing you, and rotate your palms outward as you press overhead.',
		tool: 'dumbbell',
		muscle_primary: 'Front Delts',
		muscles_secondary: ['Side Delts', 'Triceps']
	},
	{
		name: 'Glute Bridge',
		description: 'Lie on your back with knees bent and drive your hips up, squeezing your glutes at the top.',
		tool: 'bodyweight',
		muscle_primary: 'Glutes',
		muscles_secondary: ['Hamstrings']
	}
];

// Stable id, derived from the name so it survives reordering of the catalog.
export function defaultExerciseId(name) {
	return 'def-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Fixed timestamp shared by all built-in exercises.
export const DEFAULT_EXERCISES_CREATED_AT = '2026-01-01T00:00:00.000Z';
