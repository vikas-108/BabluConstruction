const QUIZ_DATA = [
  {
    category: "kids",
    type: "quiz",
    question: "Which animal is the king of jungle?",
    options: ["Elephant", "Lion", "Dog", "Cat"],
    correctAnswer: "Lion",
    keywords: "animal quiz "
  },
  {
    category: "kids",
    type: "quiz",
    question: "Which fruit is red in color?",
    options: ["Banana", "Apple", "Grapes", "Orange"],
    correctAnswer: "Apple",
    keywords: "fruit quiz red color"
  },
  {
    category: "kids",
    type: "quiz",
    question: "How many months are there in a year?",
    options: ["10", "11", "12", "8"],
    correctAnswer: "12",
    keywords: "months quiz year"
  },
   // 🐶 ANIMALS
  {
    category: "kids",
    type: "quiz",
    quizType: "animals",
    question: "Which animal says Meow?",
    options: ["Dog", "Cat", "Cow", "Lion"],
    correctAnswer: "Cat",
    keywords: "animal quiz "
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "animals",
    question: "Which animal is the largest?",
    options: ["Dog", "Cat", "Elephant", "Goat"],
    correctAnswer: "Elephant",
    keywords: "animal quiz "
  },

  // 🍎 FRUITS & VEGETABLES
  {
    category: "kids",
    type: "quiz",
    quizType: "food",
    question: "Which fruit is yellow?",
    options: ["Apple", "Banana", "Grapes", "Orange"],
    correctAnswer: "Banana",
    keywords: "fruit quiz yellow"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "food",
    question: "Which vegetable is green?",
    options: ["Carrot", "Potato", "Spinach", "Tomato"],
    correctAnswer: "Spinach",
    keywords: "vegetable quiz green"
  },

  // 🔤 ALPHABETS
  {
    category: "kids",
    type: "quiz",
    quizType: "alphabet",
    question: "A for?",
    options: ["Apple", "Ball", "Cat", "Dog"],
    correctAnswer: "Apple",
    keywords: "alphabet quiz a for"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "alphabet",
    question: "B for?",
    options: ["Apple", "Ball", "Cat", "Dog"],
    correctAnswer: "Ball",
    keywords: "alphabet quiz b for"
  },

  // 🔢 NUMBERS
  {
    category: "kids",
    type: "quiz",
    quizType: "numbers",
    question: "How many legs does a dog have?",
    options: ["2", "3", "4", "6"],
    correctAnswer: "4",
    keywords: "numbers quiz dog legs"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "numbers",
    question: "What comes after 9?",
    options: ["8", "9", "10", "11"],
    correctAnswer: "10",
    keywords: "numbers quiz counting"
  },

  // 📅 MONTHS & SEASONS
  {
    category: "kids",
    type: "quiz",
    quizType: "months",
    question: "Which month comes after March?",
    options: ["February", "April", "May", "June"],
    correctAnswer: "April",
    keywords: "months quiz march after"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "months",
    question: "Which season is very cold?",
    options: ["Summer", "Rainy", "Winter", "Spring"],
    correctAnswer: "Winter",
    keywords: "season quiz cold"
  },

  // 🧠 GENERAL KNOWLEDGE
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which one flies in the sky?",
    options: ["Car", "Bus", "Aeroplane", "Bicycle"],
    correctAnswer: "Aeroplane",
    keywords: "kids quiz fly sky"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which one is used to write?",
    options: ["Pen", "Shoe", "Plate", "Ball"],
    correctAnswer: "Pen",
    keywords: "kids quiz write"
  },
   {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which planet do we live on?",
    options: ["Mars", "Earth", "Moon", "Jupiter"],
    correctAnswer: "Earth",
    keywords: "gk planet earth world"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "What gives us light in the day?",
    options: ["Moon", "Star", "Sun", "Lamp"],
    correctAnswer: "Sun",
    keywords: "gk sun light day"
  },

  // 🚗 TRANSPORT
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which vehicle runs on tracks?",
    options: ["Car", "Bus", "Train", "Bicycle"],
    correctAnswer: "Train",
    keywords: "gk transport train"
  },

  // 🏫 SCHOOL & DAILY LIFE
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which object is used to write?",
    options: ["Pen", "Plate", "Shoes", "Ball"],
    correctAnswer: "Pen",
    keywords: "gk school write pen"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which one is a fruit?",
    options: ["Carrot", "Potato", "Apple", "Onion"],
    correctAnswer: "Apple",
    keywords: "gk fruit apple"
  },

  // 🧍 BODY PARTS
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "How many eyes do we have?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    keywords: "gk body eyes"
  },

  // 🎨 COLORS & SHAPES
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "What color is the sky?",
    options: ["Green", "Blue", "Red", "Yellow"],
    correctAnswer: "Blue",
    keywords: "gk color sky"
  },

  // 🧼 SAFETY & HYGIENE
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "What should we do before eating food?",
    options: ["Sleep", "Wash hands", "Run", "Cry"],
    correctAnswer: "Wash hands",
    keywords: "gk hygiene wash hands"
  },

  // 🇮🇳 INDIA BASIC GK
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    correctAnswer: "Delhi",
    keywords: "india gk capital"
  },
  {
    category: "kids",
    type: "quiz",
    quizType: "general quiz",
    question: "Which animal is the national animal of India?",
    options: ["Lion", "Tiger", "Elephant", "Peacock"],
    correctAnswer: "Tiger",
    keywords: "india gk national animal"
  },
  {
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "What should we do before eating food?",
  options: ["Sleep", "Wash hands", "Run", "Cry"],
  correctAnswer: "Wash hands",
  keywords: "gk hygiene wash hands"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which planet is known as the Red Planet?",
  options: ["Earth", "Mars", "Venus", "Jupiter"],
  correctAnswer: "Mars",
  keywords: "gk planets mars red planet"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "How many days are there in a week?",
  options: ["5", "6", "7", "8"],
  correctAnswer: "7",
  keywords: "gk week days seven"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which animal is called the King of the Jungle?",
  options: ["Tiger", "Lion", "Elephant", "Bear"],
  correctAnswer: "Lion",
  keywords: "gk animals lion king jungle"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the largest ocean in the world?",
  options: ["Atlantic", "Indian", "Pacific", "Arctic"],
  correctAnswer: "Pacific",
  keywords: "gk oceans largest pacific"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "What do bees produce?",
  options: ["Milk", "Honey", "Butter", "Juice"],
  correctAnswer: "Honey",
  keywords: "gk bees honey"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which shape has three sides?",
  options: ["Square", "Triangle", "Circle", "Rectangle"],
  correctAnswer: "Triangle",
  keywords: "gk shapes triangle three sides"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which gas do humans need to breathe?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"],
  correctAnswer: "Oxygen",
  keywords: "gk science oxygen breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which fruit is known as the King of Fruits in India?",
  options: ["Apple", "Banana", "Mango", "Orange"],
  correctAnswer: "Mango",
  keywords: "gk fruits mango king india"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which bird is a symbol of peace?",
  options: ["Crow", "Dove", "Parrot", "Peacock"],
  correctAnswer: "Dove",
  keywords: "gk birds dove peace"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the fastest land animal?",
  options: ["Horse", "Cheetah", "Tiger", "Leopard"],
  correctAnswer: "Cheetah",
  keywords: "gk animals cheetah fastest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which festival is known as the Festival of Lights?",
  options: ["Holi", "Diwali", "Eid", "Christmas"],
  correctAnswer: "Diwali",
  keywords: "gk festivals diwali lights"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the tallest animal?",
  options: ["Elephant", "Giraffe", "Horse", "Camel"],
  correctAnswer: "Giraffe",
  keywords: "gk animals giraffe tallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national flower of India?",
  options: ["Rose", "Lotus", "Sunflower", "Lily"],
  correctAnswer: "Lotus",
  keywords: "gk india national flower lotus"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the smallest continent?",
  options: ["Asia", "Australia", "Europe", "Africa"],
  correctAnswer: "Australia",
  keywords: "gk continents smallest australia"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which organ pumps blood in the human body?",
  options: ["Brain", "Heart", "Lungs", "Kidney"],
  correctAnswer: "Heart",
  keywords: "gk human body heart blood pump"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national animal of India?",
  options: ["Lion", "Tiger", "Elephant", "Peacock"],
  correctAnswer: "Tiger",
  keywords: "gk india national animal tiger"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which instrument is used to measure temperature?",
  options: ["Barometer", "Thermometer", "Compass", "Scale"],
  correctAnswer: "Thermometer",
  keywords: "gk science thermometer temperature"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the largest planet in our solar system?",
  options: ["Earth", "Mars", "Jupiter", "Saturn"],
  correctAnswer: "Jupiter",
  keywords: "gk planets largest jupiter"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which festival is known as the Festival of Colors?",
  options: ["Diwali", "Holi", "Christmas", "Eid"],
  correctAnswer: "Holi",
  keywords: "gk festivals holi colors"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national bird of India?",
  options: ["Crow", "Parrot", "Peacock", "Sparrow"],
  correctAnswer: "Peacock",
  keywords: "gk india national bird peacock"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the largest mammal?",
  options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
  correctAnswer: "Blue Whale",
  keywords: "gk animals largest mammal blue whale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which country is called the Land of Rising Sun?",
  options: ["China", "Japan", "India", "Korea"],
  correctAnswer: "Japan",
  keywords: "gk countries japan rising sun"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the smallest bone in the human body?",
  options: ["Stapes", "Femur", "Radius", "Ulna"],
  correctAnswer: "Stapes",
  keywords: "gk human body smallest bone stapes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national sport of India?",
  options: ["Cricket", "Hockey", "Football", "Kabaddi"],
  correctAnswer: "Hockey",
  keywords: "gk india national sport hockey"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the hottest planet in the solar system?",
  options: ["Mercury", "Venus", "Mars", "Saturn"],
  correctAnswer: "Venus",
  keywords: "gk planets hottest venus"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which festival is known as the Harvest Festival of Punjab?",
  options: ["Holi", "Diwali", "Baisakhi", "Eid"],
  correctAnswer: "Baisakhi",
  keywords: "gk festivals baisakhi harvest punjab"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which vitamin is produced when our body is exposed to sunlight?",
  options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
  correctAnswer: "Vitamin D",
  keywords: "gk health vitamin d sunlight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the capital of India?",
  options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
  correctAnswer: "Delhi",
  keywords: "gk india capital delhi"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the largest desert in the world?",
  options: ["Thar", "Sahara", "Gobi", "Kalahari"],
  correctAnswer: "Sahara",
  keywords: "gk deserts largest sahara"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national currency of Japan?",
  options: ["Dollar", "Yen", "Euro", "Won"],
  correctAnswer: "Yen",
  keywords: "gk japan currency yen"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the tallest mountain in the world?",
  options: ["K2", "Mount Everest", "Kangchenjunga", "Nanda Devi"],
  correctAnswer: "Mount Everest",
  keywords: "gk mountains tallest everest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national river of India?",
  options: ["Yamuna", "Ganga", "Brahmaputra", "Narmada"],
  correctAnswer: "Ganga",
  keywords: "gk india national river ganga"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national tree of India?",
  options: ["Neem", "Banyan", "Peepal", "Mango"],
  correctAnswer: "Banyan",
  keywords: "gk india national tree banyan"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national fruit of India?",
  options: ["Banana", "Mango", "Apple", "Orange"],
  correctAnswer: "Mango",
  keywords: "gk india national fruit mango"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national song of India?",
  options: ["Jana Gana Mana", "Vande Mataram", "Saare Jahan Se Achha", "Ae Mere Watan Ke Logon"],
  correctAnswer: "Vande Mataram",
  keywords: "gk india national song vande mataram"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national anthem of India?",
  options: ["Vande Mataram", "Jana Gana Mana", "Saare Jahan Se Achha", "Ae Mere Watan Ke Logon"],
  correctAnswer: "Jana Gana Mana",
  keywords: "gk india national anthem jana gana mana"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national emblem of India?",
  options: ["Ashoka Chakra", "Lion Capital of Ashoka", "Peacock", "Tiger"],
  correctAnswer: "Lion Capital of Ashoka",
  keywords: "gk india national emblem lion capital"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national aquatic animal of India?",
  options: ["Shark", "Dolphin", "Whale", "Crocodile"],
  correctAnswer: "Dolphin",
  keywords: "gk india national aquatic animal dolphin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national reptile of India?",
  options: ["Snake", "Crocodile", "King Cobra", "Lizard"],
  correctAnswer: "King Cobra",
  keywords: "gk india national reptile king cobra"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national heritage animal of India?",
  options: ["Elephant", "Camel", "Tiger", "Lion"],
  correctAnswer: "Elephant",
  keywords: "gk india national heritage animal elephant"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national calendar of India?",
  options: ["Gregorian", "Saka", "Hijri", "Julian"],
  correctAnswer: "Saka",
  keywords: "gk india national calendar saka"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national language of India?",
  options: ["English", "Hindi", "Sanskrit", "Tamil"],
  correctAnswer: "Hindi",
  keywords: "gk india national language hindi"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national flag of India?",
  options: ["Tricolor", "Lotus Flag", "Ashoka Flag", "Peacock Flag"],
  correctAnswer: "Tricolor",
  keywords: "gk india national flag tricolor"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national currency of India?",
  options: ["Dollar", "Rupee", "Euro", "Yen"],
  correctAnswer: "Rupee",
  keywords: "gk india national currency rupee"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national game of India?",
  options: ["Cricket", "Hockey", "Kabaddi", "Football"],
  correctAnswer: "Hockey",
  keywords: "gk india national game hockey"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national motto of India?",
  options: ["Unity in Diversity", "Satyameva Jayate", "Incredible India", "Jai Hind"],
  correctAnswer: "Satyameva Jayate",
  keywords: "gk india national motto satyameva jayate"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national symbol of India?",
  options: ["Ashoka Chakra", "Lotus", "Lion Capital", "Peacock"],
  correctAnswer: "Ashoka Chakra",
  keywords: "gk india national symbol ashoka chakra"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national vegetable of India?",
  options: ["Potato", "Brinjal", "Pumpkin", "Ladyfinger"],
  correctAnswer: "Pumpkin",
  keywords: "gk india national vegetable pumpkin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national insect of India?",
  options: ["Butterfly", "Honeybee", "Dragonfly", "Ant"],
  correctAnswer: "Butterfly",
  keywords: "gk india national insect butterfly"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national museum of India?",
  options: ["National Museum Delhi", "Indian Museum Kolkata", "Chhatrapati Museum Mumbai", "Salar Jung Museum Hyderabad"],
  correctAnswer: "National Museum Delhi",
  keywords: "gk india national museum delhi"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national institute of India for space research?",
  options: ["DRDO", "ISRO", "BARC", "IIT"],
  correctAnswer: "ISRO",
  keywords: "gk india national institute space isro"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national park famous for tigers in India?",
  options: ["Jim Corbett", "Kaziranga", "Gir", "Sundarbans"],
  correctAnswer: "Jim Corbett",
  keywords: "gk india national park jim corbett tiger"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national aquatic bird of India?",
  options: ["Duck", "Kingfisher", "Swan", "Crane"],
  correctAnswer: "Kingfisher",
  keywords: "gk india national aquatic bird kingfisher"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national highway longest in India?",
  options: ["NH 44", "NH 27", "NH 19", "NH 48"],
  correctAnswer: "NH 44",
  keywords: "gk india national highway longest nh44"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national dairy brand of India?",
  options: ["Amul", "Mother Dairy", "Nandini", "Kwality"],
  correctAnswer: "Amul",
  keywords: "gk india national dairy brand amul"
},
{
  category: "kids",
  type: "quiz",
  quizType: "general quiz",
  question: "Which is the national institute for medical sciences in India?",
  options: ["AIIMS", "IIT", "NIT", "IIM"],
  correctAnswer: "AIIMS",
  keywords: "gk india national institute medical aiims"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the plant makes food?",
  options: ["Root", "Stem", "Leaf", "Flower"],
  correctAnswer: "Leaf",
  keywords: "science plants leaf photosynthesis"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "What is the center of our solar system?",
  options: ["Earth", "Moon", "Sun", "Mars"],
  correctAnswer: "Sun",
  keywords: "science astronomy sun solar system"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas do humans breathe in?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  correctAnswer: "Oxygen",
  keywords: "science human body oxygen breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ pumps blood in the human body?",
  options: ["Brain", "Heart", "Lungs", "Kidney"],
  correctAnswer: "Heart",
  keywords: "science human body heart blood pump"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is known as the Blue Planet?",
  options: ["Mars", "Earth", "Venus", "Neptune"],
  correctAnswer: "Earth",
  keywords: "science planets earth blue planet"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which vitamin do we get from sunlight?",
  options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
  correctAnswer: "Vitamin D",
  keywords: "science health vitamin d sunlight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "What is H2O commonly known as?",
  options: ["Salt", "Water", "Oxygen", "Hydrogen"],
  correctAnswer: "Water",
  keywords: "science chemistry h2o water"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is the largest in our solar system?",
  options: ["Earth", "Mars", "Jupiter", "Saturn"],
  correctAnswer: "Jupiter",
  keywords: "science planets largest jupiter"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the human body controls all activities?",
  options: ["Heart", "Brain", "Lungs", "Stomach"],
  correctAnswer: "Brain",
  keywords: "science human body brain control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the fastest animal on land?",
  options: ["Horse", "Cheetah", "Tiger", "Lion"],
  correctAnswer: "Cheetah",
  keywords: "science animals cheetah fastest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas do plants release during photosynthesis?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  correctAnswer: "Oxygen",
  keywords: "science plants photosynthesis oxygen"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which instrument is used to measure temperature?",
  options: ["Barometer", "Thermometer", "Compass", "Scale"],
  correctAnswer: "Thermometer",
  keywords: "science instruments thermometer temperature"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the hardest natural substance?",
  options: ["Iron", "Diamond", "Gold", "Silver"],
  correctAnswer: "Diamond",
  keywords: "science minerals diamond hardest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is closest to the Sun?",
  options: ["Venus", "Mercury", "Earth", "Mars"],
  correctAnswer: "Mercury",
  keywords: "science planets mercury closest sun"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which blood cells fight diseases?",
  options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
  correctAnswer: "White blood cells",
  keywords: "science human body white blood cells immunity"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest organ in the human body?",
  options: ["Heart", "Brain", "Skin", "Liver"],
  correctAnswer: "Skin",
  keywords: "science human body skin largest organ"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet has rings around it?",
  options: ["Earth", "Mars", "Saturn", "Venus"],
  correctAnswer: "Saturn",
  keywords: "science planets saturn rings"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which force pulls objects towards Earth?",
  options: ["Magnetism", "Gravity", "Friction", "Pressure"],
  correctAnswer: "Gravity",
  keywords: "science physics gravity earth"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the plant absorbs water?",
  options: ["Leaf", "Stem", "Root", "Flower"],
  correctAnswer: "Root",
  keywords: "science plants root absorb water"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest planet after Jupiter?",
  options: ["Saturn", "Neptune", "Earth", "Mars"],
  correctAnswer: "Saturn",
  keywords: "science planets saturn large planet"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to breathe?",
  options: ["Heart", "Brain", "Lungs", "Kidney"],
  correctAnswer: "Lungs",
  keywords: "science human body lungs breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the smallest planet in our solar system?",
  options: ["Mercury", "Mars", "Venus", "Pluto"],
  correctAnswer: "Mercury",
  keywords: "science planets mercury smallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the human body helps in digestion?",
  options: ["Heart", "Stomach", "Brain", "Lungs"],
  correctAnswer: "Stomach",
  keywords: "science human body stomach digestion"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest bird?",
  options: ["Peacock", "Ostrich", "Eagle", "Crow"],
  correctAnswer: "Ostrich",
  keywords: "science animals ostrich largest bird"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "What is the boiling point of water?",
  options: ["50°C", "100°C", "150°C", "200°C"],
  correctAnswer: "100°C",
  keywords: "science chemistry water boiling point"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is known for its rings?",
  options: ["Mars", "Saturn", "Venus", "Earth"],
  correctAnswer: "Saturn",
  keywords: "science planets saturn rings"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas is used by plants for photosynthesis?",
  options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "science plants photosynthesis carbon dioxide"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which blood cells carry oxygen?",
  options: ["White blood cells", "Red blood cells", "Platelets", "Plasma"],
  correctAnswer: "Red blood cells",
  keywords: "science human body red blood cells oxygen"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the plant carries water from roots to leaves?",
  options: ["Stem", "Leaf", "Flower", "Fruit"],
  correctAnswer: "Stem",
  keywords: "science plants stem water transport"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest internal organ in the human body?",
  options: ["Heart", "Liver", "Brain", "Kidney"],
  correctAnswer: "Liver",
  keywords: "science human body liver largest organ"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is farthest from the Sun?",
  options: ["Neptune", "Mars", "Earth", "Saturn"],
  correctAnswer: "Neptune",
  keywords: "science planets neptune farthest sun"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "What is the chemical symbol for gold?",
  options: ["Ag", "Au", "Fe", "Pb"],
  correctAnswer: "Au",
  keywords: "science chemistry gold symbol au"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas is filled in balloons to make them float?",
  options: ["Oxygen", "Carbon dioxide", "Helium", "Nitrogen"],
  correctAnswer: "Helium",
  keywords: "science chemistry helium balloons"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is known as Earth’s twin?",
  options: ["Mars", "Venus", "Jupiter", "Saturn"],
  correctAnswer: "Venus",
  keywords: "science planets venus earth twin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to see?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "science human body eye vision"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the fastest bird?",
  options: ["Eagle", "Falcon", "Crow", "Parrot"],
  correctAnswer: "Falcon",
  keywords: "science animals falcon fastest bird"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas do humans exhale?",
  options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "science human body exhale carbon dioxide"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the cell contains genetic material?",
  options: ["Nucleus", "Cytoplasm", "Membrane", "Mitochondria"],
  correctAnswer: "Nucleus",
  keywords: "science biology cell nucleus dna"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest bone in the human body?",
  options: ["Femur", "Tibia", "Radius", "Humerus"],
  correctAnswer: "Femur",
  keywords: "science human body femur largest bone"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which energy is obtained from the Sun?",
  options: ["Wind energy", "Solar energy", "Hydro energy", "Thermal energy"],
  correctAnswer: "Solar energy",
  keywords: "science energy solar sun"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the hardest part of the human body?",
  options: ["Bone", "Nail", "Tooth enamel", "Hair"],
  correctAnswer: "Tooth enamel",
  keywords: "science human body tooth enamel hardest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is known as the Morning Star?",
  options: ["Mars", "Venus", "Mercury", "Jupiter"],
  correctAnswer: "Venus",
  keywords: "science planets venus morning star"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to hear?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Ear",
  keywords: "science human body ear hearing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the main source of energy for Earth?",
  options: ["Moon", "Sun", "Stars", "Wind"],
  correctAnswer: "Sun",
  keywords: "science energy sun earth source"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which blood group is called the universal donor?",
  options: ["A", "B", "AB", "O"],
  correctAnswer: "O",
  keywords: "science human body blood group universal donor"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which blood group is called the universal recipient?",
  options: ["A", "B", "AB", "O"],
  correctAnswer: "AB",
  keywords: "science human body blood group universal recipient"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest planet in the solar system?",
  options: ["Earth", "Mars", "Jupiter", "Saturn"],
  correctAnswer: "Jupiter",
  keywords: "science planets jupiter largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the human body helps in smelling?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Nose",
  keywords: "science human body nose smelling"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is known as the Red Planet?",
  options: ["Earth", "Mars", "Venus", "Jupiter"],
  correctAnswer: "Mars",
  keywords: "science planets mars red planet"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "What is the chemical symbol for water?",
  options: ["H2O", "O2", "CO2", "NaCl"],
  correctAnswer: "H2O",
  keywords: "science chemistry water h2o"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to taste food?",
  options: ["Nose", "Tongue", "Ear", "Skin"],
  correctAnswer: "Tongue",
  keywords: "science human body tongue taste"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which star is closest to Earth?",
  options: ["Polaris", "Sun", "Sirius", "Alpha Centauri"],
  correctAnswer: "Sun",
  keywords: "science astronomy sun closest star"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas is used in fire extinguishers?",
  options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "science chemistry fire extinguisher carbon dioxide"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to breathe?",
  options: ["Heart", "Lungs", "Brain", "Kidney"],
  correctAnswer: "Lungs",
  keywords: "science human body lungs breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is the smallest in our solar system?",
  options: ["Mars", "Mercury", "Venus", "Earth"],
  correctAnswer: "Mercury",
  keywords: "science planets mercury smallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the plant makes seeds?",
  options: ["Root", "Stem", "Flower", "Leaf"],
  correctAnswer: "Flower",
  keywords: "science plants flower seeds"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest planet in our solar system?",
  options: ["Earth", "Mars", "Jupiter", "Saturn"],
  correctAnswer: "Jupiter",
  keywords: "science planets jupiter largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which gas is essential for breathing?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"],
  correctAnswer: "Oxygen",
  keywords: "science human body oxygen breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to smell?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Nose",
  keywords: "science human body nose smell"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which planet is known as the Morning Star?",
  options: ["Venus", "Mars", "Mercury", "Saturn"],
  correctAnswer: "Venus",
  keywords: "science planets venus morning star"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to hear?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Ear",
  keywords: "science human body ear hearing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the hardest natural substance?",
  options: ["Iron", "Diamond", "Gold", "Silver"],
  correctAnswer: "Diamond",
  keywords: "science minerals diamond hardest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which blood group is called the universal donor?",
  options: ["A", "B", "AB", "O"],
  correctAnswer: "O",
  keywords: "science human body blood group universal donor"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which blood group is called the universal recipient?",
  options: ["A", "B", "AB", "O"],
  correctAnswer: "AB",
  keywords: "science human body blood group universal recipient"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which part of the plant absorbs water?",
  options: ["Leaf", "Stem", "Root", "Flower"],
  correctAnswer: "Root",
  keywords: "science plants root absorb water"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest bird?",
  options: ["Peacock", "Ostrich", "Eagle", "Crow"],
  correctAnswer: "Ostrich",
  keywords: "science animals ostrich largest bird"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which energy is obtained from moving air?",
  options: ["Solar energy", "Wind energy", "Hydro energy", "Thermal energy"],
  correctAnswer: "Wind energy",
  keywords: "science energy wind air"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which energy is obtained from flowing water?",
  options: ["Solar energy", "Wind energy", "Hydro energy", "Thermal energy"],
  correctAnswer: "Hydro energy",
  keywords: "science energy hydro water"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which energy is obtained from the Sun?",
  options: ["Solar energy", "Wind energy", "Hydro energy", "Thermal energy"],
  correctAnswer: "Solar energy",
  keywords: "science energy solar sun"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which is the largest bone in the human body?",
  options: ["Femur", "Tibia", "Radius", "Humerus"],
  correctAnswer: "Femur",
  keywords: "science human body femur largest bone"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to see?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "science human body eye vision"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science quiz",
  question: "Which organ helps us to digest food?",
  options: ["Heart", "Stomach", "Brain", "Lungs"],
  correctAnswer: "Stomach",
  keywords: "science human body stomach digestion"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which part of the plant absorbs water from the soil?",
  options: ["Leaf", "Stem", "Root", "Flower"],
  correctAnswer: "Root",
  keywords: "biology plants root absorb water"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the powerhouse of the cell?",
  options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
  correctAnswer: "Mitochondria",
  keywords: "biology cell mitochondria powerhouse"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which pigment gives plants their green color?",
  options: ["Hemoglobin", "Chlorophyll", "Melanin", "Carotene"],
  correctAnswer: "Chlorophyll",
  keywords: "biology plants chlorophyll green pigment"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which gas do humans exhale?",
  options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "biology respiration carbon dioxide exhale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which blood cells fight infections?",
  options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
  correctAnswer: "White blood cells",
  keywords: "biology human body white blood cells immunity"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in pumping blood?",
  options: ["Brain", "Heart", "Lungs", "Kidney"],
  correctAnswer: "Heart",
  keywords: "biology human body heart blood pump"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in breathing?",
  options: ["Heart", "Lungs", "Brain", "Liver"],
  correctAnswer: "Lungs",
  keywords: "biology human body lungs breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in digestion?",
  options: ["Heart", "Stomach", "Brain", "Kidney"],
  correctAnswer: "Stomach",
  keywords: "biology human body stomach digestion"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps us to see?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "biology human body eye vision"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps us to hear?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Ear",
  keywords: "biology human body ear hearing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps us to smell?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Nose",
  keywords: "biology human body nose smell"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps us to taste food?",
  options: ["Nose", "Tongue", "Ear", "Skin"],
  correctAnswer: "Tongue",
  keywords: "biology human body tongue taste"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps us to feel touch?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Skin",
  keywords: "biology human body skin touch sense"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Sodium?",
  options: ["Na", "So", "Sn", "Sd"],
  correctAnswer: "Na",
  keywords: "chemistry sodium symbol na"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Iron?",
  options: ["Ir", "Fe", "In", "Io"],
  correctAnswer: "Fe",
  keywords: "chemistry iron symbol fe"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Oxygen?",
  options: ["O", "Ox", "Og", "Oy"],
  correctAnswer: "O",
  keywords: "chemistry oxygen symbol o"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Hydrogen?",
  options: ["H", "Hy", "Hd", "Hg"],
  correctAnswer: "H",
  keywords: "chemistry hydrogen symbol h"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Carbon?",
  options: ["C", "Ca", "Cb", "Cn"],
  correctAnswer: "C",
  keywords: "chemistry carbon symbol c"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Calcium?",
  options: ["Ca", "Cl", "Cn", "Cu"],
  correctAnswer: "Ca",
  keywords: "chemistry calcium symbol ca"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which vitamin is produced when our body is exposed to sunlight?",
  options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
  correctAnswer: "Vitamin D",
  keywords: "biology health vitamin d sunlight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ stores bile in the human body?",
  options: ["Liver", "Gallbladder", "Pancreas", "Kidney"],
  correctAnswer: "Gallbladder",
  keywords: "biology human body gallbladder bile storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ produces insulin?",
  options: ["Liver", "Pancreas", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "biology human body pancreas insulin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ purifies blood in the human body?",
  options: ["Heart", "Kidney", "Liver", "Lungs"],
  correctAnswer: "Kidney",
  keywords: "biology human body kidney purify blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ detoxifies chemicals in the human body?",
  options: ["Heart", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Liver",
  keywords: "biology human body liver detox chemicals"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ in the human body purifies blood?",
  options: ["Heart", "Kidney", "Liver", "Lungs"],
  correctAnswer: "Kidney",
  keywords: "biology human body kidney purify blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ in the human body detoxifies chemicals?",
  options: ["Heart", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Liver",
  keywords: "biology human body liver detox chemicals"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ produces bile?",
  options: ["Pancreas", "Gallbladder", "Liver", "Kidney"],
  correctAnswer: "Liver",
  keywords: "biology human body liver bile"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ stores bile?",
  options: ["Pancreas", "Gallbladder", "Liver", "Kidney"],
  correctAnswer: "Gallbladder",
  keywords: "biology human body gallbladder bile storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ produces insulin?",
  options: ["Liver", "Pancreas", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "biology human body pancreas insulin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in respiration?",
  options: ["Heart", "Lungs", "Brain", "Kidney"],
  correctAnswer: "Lungs",
  keywords: "biology human body lungs respiration"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in circulation of blood?",
  options: ["Brain", "Heart", "Lungs", "Kidney"],
  correctAnswer: "Heart",
  keywords: "biology human body heart circulation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in digestion of food?",
  options: ["Heart", "Stomach", "Brain", "Kidney"],
  correctAnswer: "Stomach",
  keywords: "biology human body stomach digestion"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in filtering blood?",
  options: ["Heart", "Kidney", "Liver", "Pancreas"],
  correctAnswer: "Kidney",
  keywords: "biology human body kidney filter blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ helps in controlling body functions?",
  options: ["Heart", "Brain", "Liver", "Kidney"],
  correctAnswer: "Brain",
  keywords: "biology human body brain control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Potassium?",
  options: ["P", "Po", "K", "Pt"],
  correctAnswer: "K",
  keywords: "chemistry potassium symbol k"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Silver?",
  options: ["Si", "Ag", "S", "Sv"],
  correctAnswer: "Ag",
  keywords: "chemistry silver symbol ag"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Copper?",
  options: ["Co", "Cu", "Cp", "C"],
  correctAnswer: "Cu",
  keywords: "chemistry copper symbol cu"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Lead?",
  options: ["Ld", "Pb", "Le", "Ln"],
  correctAnswer: "Pb",
  keywords: "chemistry lead symbol pb"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Zinc?",
  options: ["Zn", "Zc", "Zi", "Z"],
  correctAnswer: "Zn",
  keywords: "chemistry zinc symbol zn"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Magnesium?",
  options: ["Mg", "Mn", "Ma", "Ms"],
  correctAnswer: "Mg",
  keywords: "chemistry magnesium symbol mg"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Chlorine?",
  options: ["Cl", "Ch", "Cn", "Cr"],
  correctAnswer: "Cl",
  keywords: "chemistry chlorine symbol cl"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Nitrogen?",
  options: ["N", "Ni", "Nt", "Ng"],
  correctAnswer: "N",
  keywords: "chemistry nitrogen symbol n"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Phosphorus?",
  options: ["P", "Ph", "Ps", "Po"],
  correctAnswer: "P",
  keywords: "chemistry phosphorus symbol p"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Sulfur?",
  options: ["S", "Su", "Sf", "Sr"],
  correctAnswer: "S",
  keywords: "chemistry sulfur symbol s"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Neon?",
  options: ["Ne", "No", "Nn", "Ni"],
  correctAnswer: "Ne",
  keywords: "chemistry neon symbol ne"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Helium?",
  options: ["He", "Hl", "Hm", "Hu"],
  correctAnswer: "He",
  keywords: "chemistry helium symbol he"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Fluorine?",
  options: ["F", "Fl", "Fr", "Fn"],
  correctAnswer: "F",
  keywords: "chemistry fluorine symbol f"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "What is the chemical symbol for Mercury?",
  options: ["Me", "Hg", "Mc", "Mr"],
  correctAnswer: "Hg",
  keywords: "chemistry mercury symbol hg"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which part of the human body contains DNA?",
  options: ["Nucleus", "Cytoplasm", "Cell wall", "Mitochondria"],
  correctAnswer: "Nucleus",
  keywords: "biology cell dna nucleus"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which blood cells help in clotting?",
  options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
  correctAnswer: "Platelets",
  keywords: "biology human body platelets clotting"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ produces digestive enzymes?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "biology human body pancreas digestive enzymes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which organ produces red blood cells?",
  options: ["Bone marrow", "Liver", "Heart", "Kidney"],
  correctAnswer: "Bone marrow",
  keywords: "biology human body bone marrow red blood cells"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which vitamin is essential for blood clotting?",
  options: ["Vitamin A", "Vitamin B", "Vitamin K", "Vitamin D"],
  correctAnswer: "Vitamin K",
  keywords: "biology vitamins vitamin k blood clotting"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which vitamin helps in improving eyesight?",
  options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
  correctAnswer: "Vitamin A",
  keywords: "biology vitamins vitamin a eyesight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which vitamin is found in citrus fruits?",
  options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
  correctAnswer: "Vitamin C",
  keywords: "biology vitamins vitamin c citrus fruits"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which mineral is important for strong bones?",
  options: ["Iron", "Calcium", "Zinc", "Magnesium"],
  correctAnswer: "Calcium",
  keywords: "biology minerals calcium strong bones"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which mineral is important for making hemoglobin?",
  options: ["Iron", "Calcium", "Zinc", "Magnesium"],
  correctAnswer: "Iron",
  keywords: "biology minerals iron hemoglobin blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used to disinfect water?",
  options: ["Chlorine", "Oxygen", "Carbon dioxide", "Hydrogen"],
  correctAnswer: "Chlorine",
  keywords: "chemistry chlorine disinfect water"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is commonly used in table salt?",
  options: ["NaCl", "KCl", "CaCl2", "MgCl2"],
  correctAnswer: "NaCl",
  keywords: "chemistry sodium chloride table salt"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in batteries?",
  options: ["Lithium", "Sodium", "Calcium", "Magnesium"],
  correctAnswer: "Lithium",
  keywords: "chemistry lithium batteries"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in toothpaste to prevent cavities?",
  options: ["Fluoride", "Chlorine", "Calcium", "Magnesium"],
  correctAnswer: "Fluoride",
  keywords: "chemistry fluoride toothpaste cavities"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in fertilizers?",
  options: ["Nitrogen", "Carbon dioxide", "Oxygen", "Hydrogen"],
  correctAnswer: "Nitrogen",
  keywords: "chemistry nitrogen fertilizers"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in bleaching powder?",
  options: ["Calcium hypochlorite", "Sodium chloride", "Magnesium oxide", "Potassium nitrate"],
  correctAnswer: "Calcium hypochlorite",
  keywords: "chemistry calcium hypochlorite bleaching powder"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in making glass?",
  options: ["Silica", "Iron", "Copper", "Zinc"],
  correctAnswer: "Silica",
  keywords: "chemistry silica glass making"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in making cement?",
  options: ["Limestone", "Sand", "Clay", "Silica"],
  correctAnswer: "Limestone",
  keywords: "chemistry limestone cement making"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in matchsticks?",
  options: ["Phosphorus", "Sulfur", "Carbon", "Magnesium"],
  correctAnswer: "Phosphorus",
  keywords: "chemistry phosphorus matchsticks"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in fireworks?",
  options: ["Sulfur", "Phosphorus", "Magnesium", "All of these"],
  correctAnswer: "All of these",
  keywords: "chemistry fireworks sulfur phosphorus magnesium"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in soft drinks?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "chemistry carbon dioxide soft drinks"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in photosynthesis?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "biology plants photosynthesis carbon dioxide"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in respiration?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  correctAnswer: "Oxygen",
  keywords: "biology respiration oxygen breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in protein building?",
  options: ["Nitrogen", "Carbon", "Oxygen", "Hydrogen"],
  correctAnswer: "Nitrogen",
  keywords: "biology proteins nitrogen building"
},
{
  category: "kids",
  type: "quiz",
  quizType: "science biology and chemical quiz",
  question: "Which chemical is used in DNA structure?",
  options: ["Phosphorus", "Carbon", "Nitrogen", "Hydrogen"],
  correctAnswer: "Phosphorus",
  keywords: "biology dna phosphorus backbone"
},
// human body questions 
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ pumps blood in the human body?",
  options: ["Brain", "Heart", "Lungs", "Kidney"],
  correctAnswer: "Heart",
  keywords: "human body heart blood pump"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ controls all activities of the body?",
  options: ["Heart", "Brain", "Lungs", "Stomach"],
  correctAnswer: "Brain",
  keywords: "human body brain control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps us to breathe?",
  options: ["Heart", "Lungs", "Kidney", "Liver"],
  correctAnswer: "Lungs",
  keywords: "human body lungs breathing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in digestion of food?",
  options: ["Heart", "Stomach", "Brain", "Kidney"],
  correctAnswer: "Stomach",
  keywords: "human body stomach digestion"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ purifies blood?",
  options: ["Heart", "Kidney", "Liver", "Pancreas"],
  correctAnswer: "Kidney",
  keywords: "human body kidney purify blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ detoxifies chemicals?",
  options: ["Heart", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Liver",
  keywords: "human body liver detox chemicals"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces insulin?",
  options: ["Liver", "Pancreas", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas insulin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ stores bile?",
  options: ["Pancreas", "Gallbladder", "Liver", "Kidney"],
  correctAnswer: "Gallbladder",
  keywords: "human body gallbladder bile storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps us to see?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "human body eye vision"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps us to hear?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Ear",
  keywords: "human body ear hearing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps us to smell?",
  options: ["Ear", "Eye", "Nose", "Skin"],
  correctAnswer: "Nose",
  keywords: "human body nose smell"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps us to taste food?",
  options: ["Nose", "Tongue", "Ear", "Skin"],
  correctAnswer: "Tongue",
  keywords: "human body tongue taste"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps us to feel touch?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Skin",
  keywords: "human body skin touch sense"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which blood cells carry oxygen?",
  options: ["White blood cells", "Red blood cells", "Platelets", "Plasma"],
  correctAnswer: "Red blood cells",
  keywords: "human body red blood cells oxygen"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which blood cells fight infections?",
  options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
  correctAnswer: "White blood cells",
  keywords: "human body white blood cells immunity"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which blood cells help in clotting?",
  options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
  correctAnswer: "Platelets",
  keywords: "human body platelets clotting"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which is the largest bone in the human body?",
  options: ["Femur", "Tibia", "Radius", "Humerus"],
  correctAnswer: "Femur",
  keywords: "human body femur largest bone"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which is the smallest bone in the human body?",
  options: ["Stapes", "Femur", "Radius", "Ulna"],
  correctAnswer: "Stapes",
  keywords: "human body stapes smallest bone ear"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which is the largest organ in the human body?",
  options: ["Heart", "Brain", "Skin", "Liver"],
  correctAnswer: "Skin",
  keywords: "human body skin largest organ"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which is the hardest part of the human body?",
  options: ["Bone", "Nail", "Tooth enamel", "Hair"],
  correctAnswer: "Tooth enamel",
  keywords: "human body tooth enamel hardest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in balancing the body?",
  options: ["Brain", "Ear", "Eye", "Skin"],
  correctAnswer: "Ear",
  keywords: "human body ear balance"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in controlling emotions?",
  options: ["Heart", "Brain", "Liver", "Kidney"],
  correctAnswer: "Brain",
  keywords: "human body brain emotions control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in filtering toxins?",
  options: ["Heart", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Liver",
  keywords: "human body liver filter toxins"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing urine?",
  options: ["Heart", "Kidney", "Liver", "Pancreas"],
  correctAnswer: "Kidney",
  keywords: "human body kidney urine production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces bile juice?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver bile juice"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ stores bile juice?",
  options: ["Gallbladder", "Pancreas", "Kidney", "Liver"],
  correctAnswer: "Gallbladder",
  keywords: "human body gallbladder bile storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces digestive enzymes?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas digestive enzymes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces red blood cells?",
  options: ["Bone marrow", "Liver", "Kidney", "Heart"],
  correctAnswer: "Bone marrow",
  keywords: "human body bone marrow red blood cells"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces urine?",
  options: ["Kidney", "Liver", "Pancreas", "Heart"],
  correctAnswer: "Kidney",
  keywords: "human body kidney urine production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces hormones?",
  options: ["Endocrine glands", "Heart", "Kidney", "Liver"],
  correctAnswer: "Endocrine glands",
  keywords: "human body endocrine glands hormones"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in balancing the body?",
  options: ["Brain", "Ear", "Eye", "Skin"],
  correctAnswer: "Ear",
  keywords: "human body ear balance"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in controlling emotions?",
  options: ["Heart", "Brain", "Liver", "Kidney"],
  correctAnswer: "Brain",
  keywords: "human body brain emotions control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in filtering toxins?",
  options: ["Heart", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Liver",
  keywords: "human body liver filter toxins"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in respiration?",
  options: ["Heart", "Lungs", "Brain", "Kidney"],
  correctAnswer: "Lungs",
  keywords: "human body lungs respiration"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in circulation of blood?",
  options: ["Brain", "Heart", "Lungs", "Kidney"],
  correctAnswer: "Heart",
  keywords: "human body heart circulation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in digestion of food?",
  options: ["Heart", "Stomach", "Brain", "Kidney"],
  correctAnswer: "Stomach",
  keywords: "human body stomach digestion"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in filtering blood?",
  options: ["Heart", "Kidney", "Liver", "Pancreas"],
  correctAnswer: "Kidney",
  keywords: "human body kidney filter blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in controlling body functions?",
  options: ["Heart", "Brain", "Liver", "Kidney"],
  correctAnswer: "Brain",
  keywords: "human body brain control functions"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing sweat?",
  options: ["Skin", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Skin",
  keywords: "human body skin sweat production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing saliva?",
  options: ["Salivary glands", "Pancreas", "Liver", "Kidney"],
  correctAnswer: "Salivary glands",
  keywords: "human body salivary glands saliva"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing tears?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "human body eye tears production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing sound?",
  options: ["Lungs", "Voice box", "Tongue", "Ear"],
  correctAnswer: "Voice box",
  keywords: "human body voice box sound production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing milk in mothers?",
  options: ["Mammary glands", "Pancreas", "Kidney", "Liver"],
  correctAnswer: "Mammary glands",
  keywords: "human body mammary glands milk production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing blood cells?",
  options: ["Bone marrow", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Bone marrow",
  keywords: "human body bone marrow blood cells"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing energy?",
  options: ["Mitochondria", "Nucleus", "Ribosome", "Cytoplasm"],
  correctAnswer: "Mitochondria",
  keywords: "human body mitochondria energy production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing antibodies?",
  options: ["White blood cells", "Red blood cells", "Platelets", "Plasma"],
  correctAnswer: "White blood cells",
  keywords: "human body white blood cells antibodies"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing enzymes?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas enzymes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing hormones?",
  options: ["Endocrine glands", "Heart", "Kidney", "Liver"],
  correctAnswer: "Endocrine glands",
  keywords: "human body endocrine glands hormones"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in storing memory?",
  options: ["Heart", "Brain", "Kidney", "Liver"],
  correctAnswer: "Brain",
  keywords: "human body brain memory storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in controlling body temperature?",
  options: ["Skin", "Liver", "Kidney", "Heart"],
  correctAnswer: "Skin",
  keywords: "human body skin body temperature"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing red blood cells?",
  options: ["Bone marrow", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Bone marrow",
  keywords: "human body bone marrow red blood cells"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing white blood cells?",
  options: ["Bone marrow", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Bone marrow",
  keywords: "human body bone marrow white blood cells"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing antibodies?",
  options: ["White blood cells", "Red blood cells", "Platelets", "Plasma"],
  correctAnswer: "White blood cells",
  keywords: "human body white blood cells antibodies"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing energy in cells?",
  options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
  correctAnswer: "Mitochondria",
  keywords: "human body mitochondria energy production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing saliva?",
  options: ["Salivary glands", "Pancreas", "Liver", "Kidney"],
  correctAnswer: "Salivary glands",
  keywords: "human body salivary glands saliva production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing tears?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "human body eye tears production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing sound?",
  options: ["Lungs", "Voice box", "Tongue", "Ear"],
  correctAnswer: "Voice box",
  keywords: "human body voice box sound production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing milk in mothers?",
  options: ["Mammary glands", "Pancreas", "Kidney", "Liver"],
  correctAnswer: "Mammary glands",
  keywords: "human body mammary glands milk production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in balancing the body?",
  options: ["Brain", "Ear", "Eye", "Skin"],
  correctAnswer: "Ear",
  keywords: "human body ear balance"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in controlling emotions?",
  options: ["Heart", "Brain", "Liver", "Kidney"],
  correctAnswer: "Brain",
  keywords: "human body brain emotions control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in filtering toxins?",
  options: ["Heart", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Liver",
  keywords: "human body liver filter toxins"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing sweat?",
  options: ["Skin", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Skin",
  keywords: "human body skin sweat production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing digestive enzymes?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas digestive enzymes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing bile?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver bile production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in storing bile?",
  options: ["Gallbladder", "Pancreas", "Kidney", "Liver"],
  correctAnswer: "Gallbladder",
  keywords: "human body gallbladder bile storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing urine?",
  options: ["Kidney", "Liver", "Pancreas", "Heart"],
  correctAnswer: "Kidney",
  keywords: "human body kidney urine production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing hormones?",
  options: ["Endocrine glands", "Heart", "Kidney", "Liver"],
  correctAnswer: "Endocrine glands",
  keywords: "human body endocrine glands hormones"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing vitamin D?",
  options: ["Skin", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Skin",
  keywords: "human body skin vitamin d sunlight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing blood plasma?",
  options: ["Liver", "Kidney", "Pancreas", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver blood plasma"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing cholesterol?",
  options: ["Liver", "Kidney", "Pancreas", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver cholesterol production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing digestive acid?",
  options: ["Stomach", "Pancreas", "Liver", "Kidney"],
  correctAnswer: "Stomach",
  keywords: "human body stomach digestive acid"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing enzymes for fat digestion?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas fat digestion enzymes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ in males produces sperm?",
  options: ["Testes", "Kidney", "Liver", "Pancreas"],
  correctAnswer: "Testes",
  keywords: "human body male reproductive testes sperm"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ in females produces eggs?",
  options: ["Ovary", "Uterus", "Kidney", "Liver"],
  correctAnswer: "Ovary",
  keywords: "human body female reproductive ovary eggs"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Where does a baby grow inside the mother’s body?",
  options: ["Stomach", "Uterus", "Liver", "Kidney"],
  correctAnswer: "Uterus",
  keywords: "human body female reproductive uterus baby growth"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ connects the baby to the mother for nutrition?",
  options: ["Placenta", "Kidney", "Pancreas", "Heart"],
  correctAnswer: "Placenta",
  keywords: "human body female reproductive placenta nutrition"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone controls male reproductive functions?",
  options: ["Estrogen", "Testosterone", "Insulin", "Adrenaline"],
  correctAnswer: "Testosterone",
  keywords: "human body male reproductive hormone testosterone"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone controls female reproductive functions?",
  options: ["Estrogen", "Testosterone", "Insulin", "Adrenaline"],
  correctAnswer: "Estrogen",
  keywords: "human body female reproductive hormone estrogen"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which system controls voluntary and involuntary actions of the body?",
  options: ["Digestive system", "Nervous system", "Circulatory system", "Respiratory system"],
  correctAnswer: "Nervous system",
  keywords: "human body nervous system actions control"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ is called the master gland?",
  options: ["Thyroid", "Pituitary gland", "Pancreas", "Adrenal gland"],
  correctAnswer: "Pituitary gland",
  keywords: "human body pituitary gland master gland"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces adrenaline?",
  options: ["Pancreas", "Adrenal glands", "Kidney", "Liver"],
  correctAnswer: "Adrenal glands",
  keywords: "human body adrenal glands adrenaline"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ produces thyroid hormone?",
  options: ["Thyroid gland", "Pituitary gland", "Pancreas", "Liver"],
  correctAnswer: "Thyroid gland",
  keywords: "human body thyroid gland hormone"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ connects the brain to the rest of the body?",
  options: ["Spinal cord", "Heart", "Kidney", "Liver"],
  correctAnswer: "Spinal cord",
  keywords: "human body spinal cord brain connection"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in pumping oxygen-rich blood?",
  options: ["Heart", "Lungs", "Kidney", "Liver"],
  correctAnswer: "Heart",
  keywords: "human body heart oxygen blood pump"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in exchanging oxygen and carbon dioxide?",
  options: ["Heart", "Lungs", "Kidney", "Liver"],
  correctAnswer: "Lungs",
  keywords: "human body lungs oxygen carbon dioxide exchange"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in absorbing nutrients?",
  options: ["Small intestine", "Large intestine", "Stomach", "Kidney"],
  correctAnswer: "Small intestine",
  keywords: "human body small intestine nutrient absorption"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in absorbing water?",
  options: ["Large intestine", "Small intestine", "Stomach", "Kidney"],
  correctAnswer: "Large intestine",
  keywords: "human body large intestine water absorption"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in filtering waste from blood?",
  options: ["Kidney", "Liver", "Pancreas", "Heart"],
  correctAnswer: "Kidney",
  keywords: "human body kidney filter waste blood"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in detoxifying harmful substances?",
  options: ["Liver", "Kidney", "Pancreas", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver detox harmful substances"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing digestive acid?",
  options: ["Stomach", "Pancreas", "Liver", "Kidney"],
  correctAnswer: "Stomach",
  keywords: "human body stomach digestive acid"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing insulin?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas insulin production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing bile?",
  options: ["Liver", "Pancreas", "Kidney", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver bile production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in storing bile?",
  options: ["Gallbladder", "Pancreas", "Kidney", "Liver"],
  correctAnswer: "Gallbladder",
  keywords: "human body gallbladder bile storage"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing sweat?",
  options: ["Skin", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Skin",
  keywords: "human body skin sweat production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing saliva?",
  options: ["Salivary glands", "Pancreas", "Liver", "Kidney"],
  correctAnswer: "Salivary glands",
  keywords: "human body salivary glands saliva production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing tears?",
  options: ["Eye", "Ear", "Nose", "Skin"],
  correctAnswer: "Eye",
  keywords: "human body eye tears production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing sound?",
  options: ["Voice box", "Lungs", "Tongue", "Ear"],
  correctAnswer: "Voice box",
  keywords: "human body voice box sound production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing milk in mothers?",
  options: ["Mammary glands", "Pancreas", "Kidney", "Liver"],
  correctAnswer: "Mammary glands",
  keywords: "human body mammary glands milk production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing vitamin D?",
  options: ["Skin", "Liver", "Kidney", "Pancreas"],
  correctAnswer: "Skin",
  keywords: "human body skin vitamin d sunlight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing cholesterol?",
  options: ["Liver", "Kidney", "Pancreas", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver cholesterol production"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing digestive enzymes for fat digestion?",
  options: ["Pancreas", "Liver", "Kidney", "Heart"],
  correctAnswer: "Pancreas",
  keywords: "human body pancreas fat digestion enzymes"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ helps in producing blood plasma?",
  options: ["Liver", "Kidney", "Pancreas", "Heart"],
  correctAnswer: "Liver",
  keywords: "human body liver blood plasma"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which part of the brain controls vision?",
  options: ["Frontal lobe", "Occipital lobe", "Parietal lobe", "Temporal lobe"],
  correctAnswer: "Occipital lobe",
  keywords: "human body brain occipital lobe vision"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which part of the brain controls hearing?",
  options: ["Frontal lobe", "Temporal lobe", "Parietal lobe", "Occipital lobe"],
  correctAnswer: "Temporal lobe",
  keywords: "human body brain temporal lobe hearing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which part of the brain controls movement?",
  options: ["Frontal lobe", "Occipital lobe", "Parietal lobe", "Temporal lobe"],
  correctAnswer: "Frontal lobe",
  keywords: "human body brain frontal lobe movement"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which blood vessels carry blood away from the heart?",
  options: ["Veins", "Arteries", "Capillaries", "Nerves"],
  correctAnswer: "Arteries",
  keywords: "human body circulatory arteries blood away heart"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which blood vessels carry blood to the heart?",
  options: ["Arteries", "Veins", "Capillaries", "Nerves"],
  correctAnswer: "Veins",
  keywords: "human body circulatory veins blood to heart"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ is responsible for reflex actions?",
  options: ["Brain", "Spinal cord", "Heart", "Kidney"],
  correctAnswer: "Spinal cord",
  keywords: "human body nervous system spinal cord reflex"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which muscle is called the strongest muscle in the human body?",
  options: ["Biceps", "Tongue", "Quadriceps", "Jaw muscle"],
  correctAnswer: "Jaw muscle",
  keywords: "human body muscles jaw strongest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which bone protects the brain?",
  options: ["Skull", "Rib cage", "Spine", "Pelvis"],
  correctAnswer: "Skull",
  keywords: "human body skeletal skull brain protection"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which bone protects the heart and lungs?",
  options: ["Skull", "Rib cage", "Spine", "Pelvis"],
  correctAnswer: "Rib cage",
  keywords: "human body skeletal rib cage heart lungs protection"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone regulates blood sugar?",
  options: ["Insulin", "Adrenaline", "Estrogen", "Thyroxine"],
  correctAnswer: "Insulin",
  keywords: "human body pancreas insulin blood sugar"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is the average length of a menstrual cycle?",
  options: ["10 days", "28 days", "40 days", "60 days"],
  correctAnswer: "28 days",
  keywords: "human body female menstrual cycle average length"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ releases eggs during the menstrual cycle?",
  options: ["Uterus", "Ovary", "Kidney", "Liver"],
  correctAnswer: "Ovary",
  keywords: "human body female ovary eggs menstrual cycle"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is the process of releasing an egg called?",
  options: ["Ovulation", "Menstruation", "Digestion", "Respiration"],
  correctAnswer: "Ovulation",
  keywords: "human body female ovulation egg release"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ sheds its lining during menstruation?",
  options: ["Ovary", "Uterus", "Kidney", "Pancreas"],
  correctAnswer: "Uterus",
  keywords: "human body female uterus menstruation lining shed"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone is mainly responsible for menstruation?",
  options: ["Insulin", "Estrogen", "Adrenaline", "Thyroxine"],
  correctAnswer: "Estrogen",
  keywords: "human body female hormone estrogen menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone prepares the uterus for pregnancy?",
  options: ["Progesterone", "Testosterone", "Insulin", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female hormone progesterone uterus pregnancy"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is the first period in a girl’s life called?",
  options: ["Menopause", "Menarche", "Ovulation", "Puberty"],
  correctAnswer: "Menarche",
  keywords: "human body female menarche first period"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is the last period in a woman’s life called?",
  options: ["Menarche", "Menopause", "Ovulation", "Puberty"],
  correctAnswer: "Menopause",
  keywords: "human body female menopause last period"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which nutrient is important during menstruation?",
  options: ["Iron", "Calcium", "Vitamin C", "Protein"],
  correctAnswer: "Iron",
  keywords: "human body female nutrition iron menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is a common symptom during menstruation?",
  options: ["Headache", "Cramps", "Fever", "Cough"],
  correctAnswer: "Cramps",
  keywords: "human body female menstruation cramps symptom"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is menstruation?",
  options: ["Shedding of uterus lining", "Breathing process", "Digestion process", "Blood circulation"],
  correctAnswer: "Shedding of uterus lining",
  keywords: "human body female menstruation uterus lining"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "On average, how many days does menstruation last?",
  options: ["1-2 days", "3-7 days", "10-15 days", "20 days"],
  correctAnswer: "3-7 days",
  keywords: "human body female menstruation average duration"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone triggers ovulation?",
  options: ["LH (Luteinizing Hormone)", "Estrogen", "Progesterone", "Insulin"],
  correctAnswer: "LH (Luteinizing Hormone)",
  keywords: "human body female ovulation hormone LH"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone thickens the uterus lining?",
  options: ["Progesterone", "Estrogen", "Testosterone", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female progesterone uterus lining"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is the first menstrual cycle called?",
  options: ["Menarche", "Menopause", "Ovulation", "Puberty"],
  correctAnswer: "Menarche",
  keywords: "human body female menarche first period"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "What is the last menstrual cycle called?",
  options: ["Menarche", "Menopause", "Ovulation", "Puberty"],
  correctAnswer: "Menopause",
  keywords: "human body female menopause last period"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which nutrient is most important during menstruation?",
  options: ["Iron", "Calcium", "Vitamin C", "Protein"],
  correctAnswer: "Iron",
  keywords: "human body female menstruation iron nutrient"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which common symptom occurs during menstruation?",
  options: ["Cramps", "Fever", "Cough", "Sneezing"],
  correctAnswer: "Cramps",
  keywords: "human body female menstruation cramps symptom"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone drops to start menstruation?",
  options: ["Progesterone", "Estrogen", "Insulin", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female progesterone drop menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which cycle prepares the female body for pregnancy?",
  options: ["Menstrual cycle", "Respiratory cycle", "Digestive cycle", "Circulatory cycle"],
  correctAnswer: "Menstrual cycle",
  keywords: "human body female menstrual cycle pregnancy preparation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ is mainly involved in menstruation?",
  options: ["Uterus", "Kidney", "Liver", "Pancreas"],
  correctAnswer: "Uterus",
  keywords: "human body female uterus menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which phase occurs before menstruation?",
  options: ["Luteal phase", "Follicular phase", "Ovulation", "Menopause"],
  correctAnswer: "Luteal phase",
  keywords: "human body female luteal phase menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which phase occurs after menstruation?",
  options: ["Follicular phase", "Luteal phase", "Menopause", "Puberty"],
  correctAnswer: "Follicular phase",
  keywords: "human body female follicular phase menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone rises during ovulation?",
  options: ["LH", "Estrogen", "Progesterone", "Insulin"],
  correctAnswer: "Estrogen",
  keywords: "human body female estrogen ovulation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which cycle stops permanently at menopause?",
  options: ["Menstrual cycle", "Respiratory cycle", "Digestive cycle", "Circulatory cycle"],
  correctAnswer: "Menstrual cycle",
  keywords: "human body female menopause menstrual cycle stop"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone is measured in pregnancy tests?",
  options: ["hCG", "Estrogen", "Progesterone", "Insulin"],
  correctAnswer: "hCG",
  keywords: "human body female pregnancy test hormone hCG"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ releases eggs?",
  options: ["Ovary", "Uterus", "Kidney", "Liver"],
  correctAnswer: "Ovary",
  keywords: "human body female ovary egg release"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ sheds lining during menstruation?",
  options: ["Uterus", "Ovary", "Kidney", "Pancreas"],
  correctAnswer: "Uterus",
  keywords: "human body female uterus lining shed"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone maintains pregnancy?",
  options: ["Progesterone", "Estrogen", "Testosterone", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female progesterone pregnancy"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone is responsible for female secondary sexual characteristics?",
  options: ["Estrogen", "Testosterone", "Insulin", "Adrenaline"],
  correctAnswer: "Estrogen",
  keywords: "human body female estrogen secondary sexual characteristics"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone is responsible for male secondary sexual characteristics?",
  options: ["Testosterone", "Estrogen", "Insulin", "Adrenaline"],
  correctAnswer: "Testosterone",
  keywords: "human body male testosterone secondary sexual characteristics"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which cycle is repeated monthly in women?",
  options: ["Menstrual cycle", "Respiratory cycle", "Digestive cycle", "Circulatory cycle"],
  correctAnswer: "Menstrual cycle",
  keywords: "human body female menstrual cycle monthly"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone level drops to cause menstruation?",
  options: ["Progesterone", "Estrogen", "Insulin", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female progesterone drop menstruation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ prepares lining for pregnancy?",
  options: ["Uterus", "Ovary", "Kidney", "Liver"],
  correctAnswer: "Uterus",
  keywords: "human body female uterus lining pregnancy"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which phase of the menstrual cycle involves egg release?",
  options: ["Follicular phase", "Ovulation", "Luteal phase", "Menstruation"],
  correctAnswer: "Ovulation",
  keywords: "human body female ovulation menstrual cycle"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone rises just before ovulation?",
  options: ["LH", "Estrogen", "Progesterone", "Insulin"],
  correctAnswer: "LH",
  keywords: "human body female hormone LH ovulation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone helps in thickening the uterus lining?",
  options: ["Progesterone", "Estrogen", "Testosterone", "Adrenaline"],
  correctAnswer: "Estrogen",
  keywords: "human body female estrogen uterus lining"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which phase occurs after ovulation?",
  options: ["Follicular phase", "Luteal phase", "Menstruation", "Menopause"],
  correctAnswer: "Luteal phase",
  keywords: "human body female luteal phase menstrual cycle"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone maintains pregnancy if fertilization occurs?",
  options: ["Progesterone", "Estrogen", "Testosterone", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female progesterone pregnancy maintenance"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone is tested to confirm pregnancy?",
  options: ["hCG", "Estrogen", "Progesterone", "Insulin"],
  correctAnswer: "hCG",
  keywords: "human body female pregnancy test hormone hCG"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which cycle stops permanently at menopause?",
  options: ["Menstrual cycle", "Respiratory cycle", "Digestive cycle", "Circulatory cycle"],
  correctAnswer: "Menstrual cycle",
  keywords: "human body female menopause menstrual cycle stop"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which age range usually marks the start of menstruation?",
  options: ["8-16 years", "18-25 years", "25-30 years", "30-40 years"],
  correctAnswer: "8-16 years",
  keywords: "human body female menarche age range"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which age range usually marks menopause?",
  options: ["20-30 years", "30-40 years", "45-55 years", "60-70 years"],
  correctAnswer: "45-55 years",
  keywords: "human body female menopause age range"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which common symptom occurs before menstruation?",
  options: ["PMS (Premenstrual Syndrome)", "Fever", "Cough", "Sneezing"],
  correctAnswer: "PMS (Premenstrual Syndrome)",
  keywords: "human body female PMS premenstrual syndrome"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which nutrient helps reduce fatigue during menstruation?",
  options: ["Iron", "Vitamin B12", "Calcium", "Vitamin D"],
  correctAnswer: "Vitamin B12",
  keywords: "human body female menstruation vitamin b12 fatigue"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which mineral helps reduce cramps during menstruation?",
  options: ["Magnesium", "Iron", "Calcium", "Zinc"],
  correctAnswer: "Magnesium",
  keywords: "human body female menstruation magnesium cramps relief"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone level drops to trigger menstruation?",
  options: ["Progesterone", "Estrogen", "Insulin", "Adrenaline"],
  correctAnswer: "Progesterone",
  keywords: "human body female progesterone drop menstruation trigger"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which organ prepares lining for pregnancy every cycle?",
  options: ["Uterus", "Ovary", "Kidney", "Liver"],
  correctAnswer: "Uterus",
  keywords: "human body female uterus lining pregnancy preparation"
},
{
  category: "kids",
  type: "quiz",
  quizType: "human body quiz",
  question: "Which hormone is responsible for female secondary sexual characteristics?",
  options: ["Estrogen", "Testosterone", "Insulin", "Adrenaline"],
  correctAnswer: "Estrogen",
  keywords: "human body female estrogen secondary sexual characteristics"
},
// nature quizzess
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest desert in the world?",
  options: ["Sahara Desert", "Gobi Desert", "Antarctic Desert", "Thar Desert"],
  correctAnswer: "Antarctic Desert",
  keywords: "nature desert antarctic largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the tallest mountain in the world?",
  options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
  correctAnswer: "Mount Everest",
  keywords: "nature mountain mount everest tallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest animal on Earth?",
  options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
  correctAnswer: "Blue Whale",
  keywords: "nature animal blue whale largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which bird is known for its ability to mimic sounds?",
  options: ["Parrot", "Crow", "Owl", "Sparrow"],
  correctAnswer: "Parrot",
  keywords: "nature bird parrot mimic sounds"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which tree is considered sacred in India?",
  options: ["Neem", "Banyan", "Peepal", "Mango"],
  correctAnswer: "Peepal",
  keywords: "nature tree peepal sacred india"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the fastest bird in the world?",
  options: ["Eagle", "Falcon", "Crow", "Parrot"],
  correctAnswer: "Falcon",
  keywords: "nature bird falcon fastest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest flower in the world?",
  options: ["Rose", "Rafflesia", "Sunflower", "Lotus"],
  correctAnswer: "Rafflesia",
  keywords: "nature flower rafflesia largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which gas do humans need to survive?",
  options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
  correctAnswer: "Oxygen",
  keywords: "nature oxygen survival humans"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the national animal of India?",
  options: ["Lion", "Tiger", "Elephant", "Leopard"],
  correctAnswer: "Tiger",
  keywords: "nature india national animal tiger"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the national bird of India?",
  options: ["Crow", "Parrot", "Peacock", "Sparrow"],
  correctAnswer: "Peacock",
  keywords: "nature india national bird peacock"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest river in the world?",
  options: ["Amazon River", "Nile River", "Ganga River", "Yangtze River"],
  correctAnswer: "Nile River",
  keywords: "nature river nile largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest continent?",
  options: ["Africa", "Asia", "Europe", "Australia"],
  correctAnswer: "Asia",
  keywords: "nature continent asia largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the smallest continent?",
  options: ["Australia", "Europe", "Antarctica", "South America"],
  correctAnswer: "Australia",
  keywords: "nature continent australia smallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest island in the world?",
  options: ["Greenland", "Madagascar", "Borneo", "Sumatra"],
  correctAnswer: "Greenland",
  keywords: "nature island greenland largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the deepest ocean trench?",
  options: ["Mariana Trench", "Java Trench", "Puerto Rico Trench", "Tonga Trench"],
  correctAnswer: "Mariana Trench",
  keywords: "nature ocean mariana trench deepest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest volcano in the world?",
  options: ["Mount Fuji", "Mauna Loa", "Krakatoa", "Etna"],
  correctAnswer: "Mauna Loa",
  keywords: "nature volcano mauna loa largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest coral reef system?",
  options: ["Great Barrier Reef", "Red Sea Reef", "Caribbean Reef", "Maldives Reef"],
  correctAnswer: "Great Barrier Reef",
  keywords: "nature coral reef great barrier largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest mammal on land?",
  options: ["Elephant", "Giraffe", "Rhino", "Hippo"],
  correctAnswer: "Elephant",
  keywords: "nature mammal elephant largest land"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the fastest aquatic animal?",
  options: ["Dolphin", "Sailfish", "Shark", "Whale"],
  correctAnswer: "Sailfish",
  keywords: "nature aquatic animal sailfish fastest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest bird?",
  options: ["Eagle", "Ostrich", "Peacock", "Swan"],
  correctAnswer: "Ostrich",
  keywords: "nature bird ostrich largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the national tree of India?",
  options: ["Neem", "Banyan", "Peepal", "Mango"],
  correctAnswer: "Banyan",
  keywords: "nature india national tree banyan"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the national flower of India?",
  options: ["Rose", "Lotus", "Sunflower", "Jasmine"],
  correctAnswer: "Lotus",
  keywords: "nature india national flower lotus"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest glacier in the world?",
  options: ["Lambert Glacier", "Siachen Glacier", "Perito Moreno Glacier", "Baltoro Glacier"],
  correctAnswer: "Lambert Glacier",
  keywords: "nature glacier lambert largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest waterfall in the world?",
  options: ["Niagara Falls", "Angel Falls", "Victoria Falls", "Iguazu Falls"],
  correctAnswer: "Angel Falls",
  keywords: "nature waterfall angel falls largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest lake in the world?",
  options: ["Lake Superior", "Caspian Sea", "Lake Victoria", "Lake Baikal"],
  correctAnswer: "Caspian Sea",
  keywords: "nature lake caspian largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the smallest ocean in the world?",
  options: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"],
  correctAnswer: "Arctic Ocean",
  keywords: "nature ocean arctic smallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which animal is known as the ship of the desert?",
  options: ["Horse", "Camel", "Elephant", "Donkey"],
  correctAnswer: "Camel",
  keywords: "nature animal camel desert ship"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which bird is a symbol of peace?",
  options: ["Crow", "Dove", "Parrot", "Sparrow"],
  correctAnswer: "Dove",
  keywords: "nature bird dove peace symbol"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest land carnivore?",
  options: ["Lion", "Tiger", "Polar Bear", "Leopard"],
  correctAnswer: "Polar Bear",
  keywords: "nature animal polar bear largest carnivore"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the national park famous for lions in India?",
  options: ["Kaziranga", "Gir National Park", "Jim Corbett", "Sundarbans"],
  correctAnswer: "Gir National Park",
  keywords: "nature india gir national park lions"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest land biome?",
  options: ["Desert", "Grassland", "Taiga", "Rainforest"],
  correctAnswer: "Taiga",
  keywords: "nature biome taiga largest land"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the national aquatic animal of India?",
  options: ["Dolphin", "Shark", "Whale", "Crocodile"],
  correctAnswer: "Dolphin",
  keywords: "nature india national aquatic animal dolphin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest reptile?",
  options: ["Snake", "Komodo Dragon", "Crocodile", "Tortoise"],
  correctAnswer: "Crocodile",
  keywords: "nature reptile crocodile largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the fastest marine mammal?",
  options: ["Dolphin", "Orca", "Seal", "Whale"],
  correctAnswer: "Dolphin",
  keywords: "nature marine mammal dolphin fastest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of shark?",
  options: ["Great White Shark", "Hammerhead Shark", "Whale Shark", "Tiger Shark"],
  correctAnswer: "Whale Shark",
  keywords: "nature marine whale shark largest species"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest amphibian?",
  options: ["Frog", "Salamander", "Toad", "Caecilian"],
  correctAnswer: "Salamander",
  keywords: "nature amphibian salamander largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which plant is known as the national flower of Japan?",
  options: ["Rose", "Cherry Blossom", "Lotus", "Sunflower"],
  correctAnswer: "Cherry Blossom",
  keywords: "nature japan national flower cherry blossom"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living bird?",
  options: ["Eagle", "Ostrich", "Peacock", "Swan"],
  correctAnswer: "Ostrich",
  keywords: "nature bird ostrich largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest rodent in the world?",
  options: ["Rat", "Beaver", "Capybara", "Porcupine"],
  correctAnswer: "Capybara",
  keywords: "nature rodent capybara largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest penguin species?",
  options: ["Emperor Penguin", "King Penguin", "Gentoo Penguin", "Adelie Penguin"],
  correctAnswer: "Emperor Penguin",
  keywords: "nature bird emperor penguin largest species"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest marsupial?",
  options: ["Koala", "Kangaroo", "Wallaby", "Opossum"],
  correctAnswer: "Kangaroo",
  keywords: "nature marsupial kangaroo largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest primate?",
  options: ["Chimpanzee", "Gorilla", "Orangutan", "Baboon"],
  correctAnswer: "Gorilla",
  keywords: "nature primate gorilla largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest butterfly?",
  options: ["Monarch", "Queen Alexandra’s Birdwing", "Swallowtail", "Painted Lady"],
  correctAnswer: "Queen Alexandra’s Birdwing",
  keywords: "nature insect butterfly queen alexandra largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest rainforest in the world?",
  options: ["Amazon", "Congo", "Daintree", "Sundarbans"],
  correctAnswer: "Amazon",
  keywords: "nature rainforest amazon largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest river by volume of water?",
  options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
  correctAnswer: "Amazon River",
  keywords: "nature river amazon largest volume"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest waterfall by height?",
  options: ["Niagara Falls", "Angel Falls", "Victoria Falls", "Iguazu Falls"],
  correctAnswer: "Angel Falls",
  keywords: "nature waterfall angel falls tallest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest hot desert?",
  options: ["Sahara", "Thar", "Gobi", "Kalahari"],
  correctAnswer: "Sahara",
  keywords: "nature desert sahara largest hot"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the coldest continent?",
  options: ["Asia", "Europe", "Antarctica", "North America"],
  correctAnswer: "Antarctica",
  keywords: "nature continent antarctica coldest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living reptile?",
  options: ["Komodo Dragon", "Crocodile", "Alligator", "Tortoise"],
  correctAnswer: "Crocodile",
  keywords: "nature reptile crocodile largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of bear?",
  options: ["Polar Bear", "Brown Bear", "Grizzly Bear", "Black Bear"],
  correctAnswer: "Polar Bear",
  keywords: "nature animal polar bear largest species"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of deer?",
  options: ["Moose", "Reindeer", "Elk", "Sambar"],
  correctAnswer: "Moose",
  keywords: "nature animal moose largest deer"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of cat?",
  options: ["Lion", "Tiger", "Leopard", "Cheetah"],
  correctAnswer: "Tiger",
  keywords: "nature animal tiger largest cat"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of dog?",
  options: ["German Shepherd", "Great Dane", "St. Bernard", "Wolf"],
  correctAnswer: "Great Dane",
  keywords: "nature animal great dane largest dog"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of fish?",
  options: ["Whale Shark", "Great White Shark", "Tuna", "Swordfish"],
  correctAnswer: "Whale Shark",
  keywords: "nature fish whale shark largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of turtle?",
  options: ["Leatherback Turtle", "Green Turtle", "Hawksbill Turtle", "Loggerhead Turtle"],
  correctAnswer: "Leatherback Turtle",
  keywords: "nature reptile leatherback turtle largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of frog?",
  options: ["Bullfrog", "Goliath Frog", "Tree Frog", "Poison Dart Frog"],
  correctAnswer: "Goliath Frog",
  keywords: "nature amphibian goliath frog largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of butterfly?",
  options: ["Monarch", "Queen Alexandra’s Birdwing", "Swallowtail", "Painted Lady"],
  correctAnswer: "Queen Alexandra’s Birdwing",
  keywords: "nature insect butterfly queen alexandra largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of bee?",
  options: ["Honeybee", "Carpenter Bee", "Wallace’s Giant Bee", "Bumblebee"],
  correctAnswer: "Wallace’s Giant Bee",
  keywords: "nature insect bee wallace giant largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of ant?",
  options: ["Army Ant", "Driver Ant", "Bullet Ant", "Giant Amazonian Ant"],
  correctAnswer: "Giant Amazonian Ant",
  keywords: "nature insect ant giant amazon largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of snake?",
  options: ["Python", "Anaconda", "Cobra", "Viper"],
  correctAnswer: "Anaconda",
  keywords: "nature reptile anaconda largest snake"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of lizard?",
  options: ["Gecko", "Komodo Dragon", "Monitor Lizard", "Iguana"],
  correctAnswer: "Komodo Dragon",
  keywords: "nature reptile komodo dragon largest lizard"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of penguin?",
  options: ["Emperor Penguin", "King Penguin", "Gentoo Penguin", "Adelie Penguin"],
  correctAnswer: "Emperor Penguin",
  keywords: "nature bird emperor penguin largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest species of eagle?",
  options: ["Golden Eagle", "Bald Eagle", "Harpy Eagle", "Steppe Eagle"],
  correctAnswer: "Harpy Eagle",
  keywords: "nature bird harpy eagle largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon is measured by the Richter scale?",
  options: ["Volcano", "Earthquake", "Tsunami", "Cyclone"],
  correctAnswer: "Earthquake",
  keywords: "nature phenomenon earthquake richter scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon is measured by the Beaufort scale?",
  options: ["Wind speed", "Rainfall", "Temperature", "Humidity"],
  correctAnswer: "Wind speed",
  keywords: "nature phenomenon wind speed beaufort scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon is measured by the Saffir-Simpson scale?",
  options: ["Cyclones", "Earthquakes", "Floods", "Volcanoes"],
  correctAnswer: "Cyclones",
  keywords: "nature phenomenon cyclone saffir simpson scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon is measured by the Fujita scale?",
  options: ["Tornadoes", "Earthquakes", "Floods", "Volcanoes"],
  correctAnswer: "Tornadoes",
  keywords: "nature phenomenon tornado fujita scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest mangrove forest in the world?",
  options: ["Sundarbans", "Florida Mangroves", "Amazon Mangroves", "Congo Mangroves"],
  correctAnswer: "Sundarbans",
  keywords: "nature forest sundarbans mangrove largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest national park in the world?",
  options: ["Yellowstone", "Northeast Greenland National Park", "Kruger", "Banff"],
  correctAnswer: "Northeast Greenland National Park",
  keywords: "nature national park northeast greenland largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest canyon in the world?",
  options: ["Grand Canyon", "Yarlung Tsangpo Canyon", "Copper Canyon", "Fish River Canyon"],
  correctAnswer: "Yarlung Tsangpo Canyon",
  keywords: "nature canyon yarlung tsangpo largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest plateau in the world?",
  options: ["Deccan Plateau", "Tibetan Plateau", "Colorado Plateau", "Patagonian Plateau"],
  correctAnswer: "Tibetan Plateau",
  keywords: "nature plateau tibetan largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest bay in the world?",
  options: ["Bay of Bengal", "Hudson Bay", "San Francisco Bay", "Chesapeake Bay"],
  correctAnswer: "Bay of Bengal",
  keywords: "nature bay bay of bengal largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest gulf in the world?",
  options: ["Gulf of Mexico", "Persian Gulf", "Gulf of Aden", "Gulf of Alaska"],
  correctAnswer: "Gulf of Mexico",
  keywords: "nature gulf gulf of mexico largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest delta in the world?",
  options: ["Ganga-Brahmaputra Delta", "Nile Delta", "Amazon Delta", "Mississippi Delta"],
  correctAnswer: "Ganga-Brahmaputra Delta",
  keywords: "nature delta ganga brahmaputra largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest freshwater lake by volume?",
  options: ["Lake Baikal", "Lake Victoria", "Lake Superior", "Lake Tanganyika"],
  correctAnswer: "Lake Baikal",
  keywords: "nature lake baikal freshwater largest volume"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest saltwater lake?",
  options: ["Caspian Sea", "Dead Sea", "Great Salt Lake", "Lake Urmia"],
  correctAnswer: "Caspian Sea",
  keywords: "nature lake caspian saltwater largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest hot spring in the world?",
  options: ["Grand Prismatic Spring", "Blue Lagoon", "Pamukkale", "Frying Pan Lake"],
  correctAnswer: "Frying Pan Lake",
  keywords: "nature hot spring frying pan largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest geyser in the world?",
  options: ["Steamboat Geyser", "Old Faithful", "Fly Geyser", "Lady Knox"],
  correctAnswer: "Steamboat Geyser",
  keywords: "nature geyser steamboat largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest coral reef system?",
  options: ["Great Barrier Reef", "Red Sea Reef", "Caribbean Reef", "Maldives Reef"],
  correctAnswer: "Great Barrier Reef",
  keywords: "nature coral reef great barrier largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest glacier in the Himalayas?",
  options: ["Siachen Glacier", "Baltoro Glacier", "Gangotri Glacier", "Zemu Glacier"],
  correctAnswer: "Siachen Glacier",
  keywords: "nature glacier siachen himalayas largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest volcano on Earth?",
  options: ["Mount Etna", "Mount Fuji", "Mauna Loa", "Krakatoa"],
  correctAnswer: "Mauna Loa",
  keywords: "nature volcano mauna loa largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest ecosystem on Earth?",
  options: ["Ocean", "Forest", "Grassland", "Desert"],
  correctAnswer: "Ocean",
  keywords: "nature ecosystem ocean largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living organism on Earth?",
  options: ["Blue Whale", "Armillaria Fungus", "Sequoia Tree", "Coral Reef"],
  correctAnswer: "Armillaria Fungus",
  keywords: "nature organism armillaria fungus largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest carnivorous plant?",
  options: ["Venus Flytrap", "Pitcher Plant", "Nepenthes Rajah", "Sundew"],
  correctAnswer: "Nepenthes Rajah",
  keywords: "nature plant nepenthes rajah largest carnivorous"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest bamboo species?",
  options: ["Giant Bamboo", "Moso Bamboo", "Black Bamboo", "Golden Bamboo"],
  correctAnswer: "Giant Bamboo",
  keywords: "nature plant giant bamboo largest species"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest palm tree species?",
  options: ["Coconut Palm", "Date Palm", "Quindio Wax Palm", "Oil Palm"],
  correctAnswer: "Quindio Wax Palm",
  keywords: "nature plant quindio wax palm largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural disaster is measured by the Richter scale?",
  options: ["Earthquake", "Volcano", "Cyclone", "Flood"],
  correctAnswer: "Earthquake",
  keywords: "nature disaster earthquake richter scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural disaster is measured by the Saffir-Simpson scale?",
  options: ["Cyclone", "Earthquake", "Flood", "Volcano"],
  correctAnswer: "Cyclone",
  keywords: "nature disaster cyclone saffir simpson scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural disaster is measured by the Fujita scale?",
  options: ["Tornado", "Earthquake", "Flood", "Volcano"],
  correctAnswer: "Tornado",
  keywords: "nature disaster tornado fujita scale"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural disaster is measured by the Volcanic Explosivity Index?",
  options: ["Volcano", "Earthquake", "Cyclone", "Flood"],
  correctAnswer: "Volcano",
  keywords: "nature disaster volcano explosivity index"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural disaster is measured by the Drought Severity Index?",
  options: ["Drought", "Flood", "Cyclone", "Earthquake"],
  correctAnswer: "Drought",
  keywords: "nature disaster drought severity index"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living tree by volume?",
  options: ["General Sherman", "Hyperion", "Banyan", "Oak"],
  correctAnswer: "General Sherman",
  keywords: "nature tree general sherman largest volume"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which tree is the tallest living tree?",
  options: ["Hyperion", "General Sherman", "Banyan", "Pine"],
  correctAnswer: "Hyperion",
  keywords: "nature tree hyperion tallest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living bird egg?",
  options: ["Ostrich", "Emu", "Penguin", "Swan"],
  correctAnswer: "Ostrich",
  keywords: "nature bird ostrich largest egg"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest marsupial?",
  options: ["Koala", "Kangaroo", "Wallaby", "Opossum"],
  correctAnswer: "Kangaroo",
  keywords: "nature marsupial kangaroo largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest primate?",
  options: ["Chimpanzee", "Gorilla", "Orangutan", "Baboon"],
  correctAnswer: "Gorilla",
  keywords: "nature primate gorilla largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest rodent?",
  options: ["Rat", "Beaver", "Capybara", "Porcupine"],
  correctAnswer: "Capybara",
  keywords: "nature rodent capybara largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest insect?",
  options: ["Goliath Beetle", "Atlas Moth", "Giant Weta", "Dragonfly"],
  correctAnswer: "Giant Weta",
  keywords: "nature insect giant weta largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest amphibian?",
  options: ["Salamander", "Frog", "Toad", "Caecilian"],
  correctAnswer: "Salamander",
  keywords: "nature amphibian salamander largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest carnivorous plant?",
  options: ["Venus Flytrap", "Pitcher Plant", "Nepenthes Rajah", "Sundew"],
  correctAnswer: "Nepenthes Rajah",
  keywords: "nature plant nepenthes rajah carnivorous largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon creates rainbows?",
  options: ["Refraction of light", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Refraction of light",
  keywords: "nature phenomenon rainbow refraction light"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon creates auroras?",
  options: ["Solar wind", "Earthquake", "Volcano", "Cyclone"],
  correctAnswer: "Solar wind",
  keywords: "nature phenomenon aurora solar wind"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes tides?",
  options: ["Moon’s gravity", "Sunlight", "Wind", "Rain"],
  correctAnswer: "Moon’s gravity",
  keywords: "nature phenomenon tides moon gravity"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes earthquakes?",
  options: ["Tectonic plate movement", "Rain", "Wind", "Volcano eruption"],
  correctAnswer: "Tectonic plate movement",
  keywords: "nature phenomenon earthquake tectonic plates"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes volcanoes?",
  options: ["Magma eruption", "Wind", "Rain", "Earthquake"],
  correctAnswer: "Magma eruption",
  keywords: "nature phenomenon volcano magma eruption"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes tsunamis?",
  options: ["Earthquake under sea", "Rain", "Wind", "Volcano eruption"],
  correctAnswer: "Earthquake under sea",
  keywords: "nature phenomenon tsunami earthquake sea"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes cyclones?",
  options: ["Low pressure system", "Earthquake", "Volcano", "Rain"],
  correctAnswer: "Low pressure system",
  keywords: "nature phenomenon cyclone low pressure"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes floods?",
  options: ["Heavy rainfall", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Heavy rainfall",
  keywords: "nature phenomenon flood heavy rainfall"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes droughts?",
  options: ["Lack of rainfall", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Lack of rainfall",
  keywords: "nature phenomenon drought lack rainfall"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes landslides?",
  options: ["Heavy rain", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Heavy rain",
  keywords: "nature phenomenon landslide heavy rain"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes avalanches?",
  options: ["Snow movement", "Earthquake", "Volcano", "Rain"],
  correctAnswer: "Snow movement",
  keywords: "nature phenomenon avalanche snow movement"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes lightning?",
  options: ["Electric discharge", "Rain", "Wind", "Volcano"],
  correctAnswer: "Electric discharge",
  keywords: "nature phenomenon lightning electric discharge"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes thunder?",
  options: ["Expansion of air", "Rain", "Wind", "Volcano"],
  correctAnswer: "Expansion of air",
  keywords: "nature phenomenon thunder expansion air"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes eclipses?",
  options: ["Shadow of Earth or Moon", "Rain", "Wind", "Volcano"],
  correctAnswer: "Shadow of Earth or Moon",
  keywords: "nature phenomenon eclipse shadow earth moon"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes seasons?",
  options: ["Tilt of Earth’s axis", "Rain", "Wind", "Volcano"],
  correctAnswer: "Tilt of Earth’s axis",
  keywords: "nature phenomenon seasons tilt earth axis"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living organism on Earth?",
  options: ["Blue Whale", "Armillaria Fungus", "Sequoia Tree", "Coral Reef"],
  correctAnswer: "Armillaria Fungus",
  keywords: "nature organism armillaria fungus largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the fastest growing plant?",
  options: ["Bamboo", "Sunflower", "Cactus", "Mango Tree"],
  correctAnswer: "Bamboo",
  keywords: "nature plant bamboo fastest growing"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living carnivore on land?",
  options: ["Lion", "Tiger", "Polar Bear", "Grizzly Bear"],
  correctAnswer: "Polar Bear",
  keywords: "nature animal polar bear largest carnivore"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living herbivore on land?",
  options: ["Elephant", "Giraffe", "Rhino", "Hippo"],
  correctAnswer: "Elephant",
  keywords: "nature animal elephant largest herbivore"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living fish?",
  options: ["Whale Shark", "Great White Shark", "Tuna", "Swordfish"],
  correctAnswer: "Whale Shark",
  keywords: "nature fish whale shark largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living bird?",
  options: ["Eagle", "Ostrich", "Peacock", "Swan"],
  correctAnswer: "Ostrich",
  keywords: "nature bird ostrich largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living mammal?",
  options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"],
  correctAnswer: "Blue Whale",
  keywords: "nature mammal blue whale largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living reptile?",
  options: ["Komodo Dragon", "Crocodile", "Alligator", "Tortoise"],
  correctAnswer: "Crocodile",
  keywords: "nature reptile crocodile largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living amphibian?",
  options: ["Salamander", "Frog", "Toad", "Caecilian"],
  correctAnswer: "Salamander",
  keywords: "nature amphibian salamander largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which is the largest living insect?",
  options: ["Goliath Beetle", "Atlas Moth", "Giant Weta", "Dragonfly"],
  correctAnswer: "Giant Weta",
  keywords: "nature insect giant weta largest living"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes auroras?",
  options: ["Solar wind", "Earthquake", "Volcano", "Cyclone"],
  correctAnswer: "Solar wind",
  keywords: "nature phenomenon aurora solar wind"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes tides?",
  options: ["Moon’s gravity", "Sunlight", "Wind", "Rain"],
  correctAnswer: "Moon’s gravity",
  keywords: "nature phenomenon tides moon gravity"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes eclipses?",
  options: ["Shadow of Earth or Moon", "Rain", "Wind", "Volcano"],
  correctAnswer: "Shadow of Earth or Moon",
  keywords: "nature phenomenon eclipse shadow earth moon"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes seasons?",
  options: ["Tilt of Earth’s axis", "Rain", "Wind", "Volcano"],
  correctAnswer: "Tilt of Earth’s axis",
  keywords: "nature phenomenon seasons tilt earth axis"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes rainbows?",
  options: ["Refraction of light", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Refraction of light",
  keywords: "nature phenomenon rainbow refraction light"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes lightning?",
  options: ["Electric discharge", "Rain", "Wind", "Volcano"],
  correctAnswer: "Electric discharge",
  keywords: "nature phenomenon lightning electric discharge"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes thunder?",
  options: ["Expansion of air", "Rain", "Wind", "Volcano"],
  correctAnswer: "Expansion of air",
  keywords: "nature phenomenon thunder expansion air"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes avalanches?",
  options: ["Snow movement", "Earthquake", "Volcano", "Rain"],
  correctAnswer: "Snow movement",
  keywords: "nature phenomenon avalanche snow movement"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes landslides?",
  options: ["Heavy rain", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Heavy rain",
  keywords: "nature phenomenon landslide heavy rain"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes droughts?",
  options: ["Lack of rainfall", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Lack of rainfall",
  keywords: "nature phenomenon drought lack rainfall"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes floods?",
  options: ["Heavy rainfall", "Earthquake", "Volcano", "Wind"],
  correctAnswer: "Heavy rainfall",
  keywords: "nature phenomenon flood heavy rainfall"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes cyclones?",
  options: ["Low pressure system", "Earthquake", "Volcano", "Rain"],
  correctAnswer: "Low pressure system",
  keywords: "nature phenomenon cyclone low pressure"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which natural phenomenon causes tsunamis?",
  options: ["Earthquake under sea", "Rain", "Wind", "Volcano eruption"],
  correctAnswer: "Earthquake under sea",
  keywords: "nature phenomenon tsunami earthquake sea"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which gas is mainly responsible for global warming?",
  options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
  correctAnswer: "Carbon dioxide",
  keywords: "nature climate global warming carbon dioxide"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which layer of the atmosphere protects us from harmful UV rays?",
  options: ["Troposphere", "Stratosphere", "Ozone layer", "Mesosphere"],
  correctAnswer: "Ozone layer",
  keywords: "nature atmosphere ozone layer UV protection"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which renewable energy source uses sunlight?",
  options: ["Wind energy", "Solar energy", "Hydropower", "Geothermal"],
  correctAnswer: "Solar energy",
  keywords: "nature renewable solar energy sunlight"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which renewable energy source uses moving air?",
  options: ["Wind energy", "Solar energy", "Hydropower", "Geothermal"],
  correctAnswer: "Wind energy",
  keywords: "nature renewable wind energy air movement"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which renewable energy source uses moving water?",
  options: ["Wind energy", "Solar energy", "Hydropower", "Geothermal"],
  correctAnswer: "Hydropower",
  keywords: "nature renewable hydropower water movement"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which renewable energy source uses heat from Earth?",
  options: ["Wind energy", "Solar energy", "Hydropower", "Geothermal"],
  correctAnswer: "Geothermal",
  keywords: "nature renewable geothermal earth heat"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which animal is known as the national aquatic animal of India?",
  options: ["Shark", "Dolphin", "Whale", "Crocodile"],
  correctAnswer: "Dolphin",
  keywords: "nature india national aquatic animal dolphin"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which animal is known as the national heritage animal of India?",
  options: ["Tiger", "Elephant", "Lion", "Leopard"],
  correctAnswer: "Elephant",
  keywords: "nature india national heritage animal elephant"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which bird is considered a symbol of peace?",
  options: ["Crow", "Dove", "Parrot", "Sparrow"],
  correctAnswer: "Dove",
  keywords: "nature bird dove peace symbol"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which animal is considered endangered due to poaching for ivory?",
  options: ["Tiger", "Elephant", "Rhino", "Leopard"],
  correctAnswer: "Elephant",
  keywords: "nature animal elephant endangered ivory poaching"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which animal is considered endangered due to poaching for horns?",
  options: ["Tiger", "Elephant", "Rhino", "Leopard"],
  correctAnswer: "Rhino",
  keywords: "nature animal rhino endangered horn poaching"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which animal is considered endangered due to poaching for skin?",
  options: ["Tiger", "Elephant", "Rhino", "Leopard"],
  correctAnswer: "Tiger",
  keywords: "nature animal tiger endangered skin poaching"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which international agreement aims to reduce greenhouse gases?",
  options: ["Kyoto Protocol", "Paris Agreement", "Montreal Protocol", "Rio Declaration"],
  correctAnswer: "Paris Agreement",
  keywords: "nature climate paris agreement greenhouse gases"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which international agreement aims to protect the ozone layer?",
  options: ["Kyoto Protocol", "Paris Agreement", "Montreal Protocol", "Rio Declaration"],
  correctAnswer: "Montreal Protocol",
  keywords: "nature climate montreal protocol ozone protection"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which international agreement aims to reduce carbon emissions?",
  options: ["Kyoto Protocol", "Paris Agreement", "Montreal Protocol", "Rio Declaration"],
  correctAnswer: "Kyoto Protocol",
  keywords: "nature climate kyoto protocol carbon emissions"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is known as the lungs of the Earth?",
  options: ["Rainforest", "Desert", "Ocean", "Grassland"],
  correctAnswer: "Rainforest",
  keywords: "nature ecosystem rainforest lungs earth"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem covers most of Earth’s surface?",
  options: ["Rainforest", "Desert", "Ocean", "Grassland"],
  correctAnswer: "Ocean",
  keywords: "nature ecosystem ocean covers earth surface"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to the largest biodiversity?",
  options: ["Rainforest", "Desert", "Ocean", "Grassland"],
  correctAnswer: "Rainforest",
  keywords: "nature ecosystem rainforest biodiversity largest"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to cactus plants?",
  options: ["Rainforest", "Desert", "Ocean", "Grassland"],
  correctAnswer: "Desert",
  keywords: "nature ecosystem desert cactus plants"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to polar bears?",
  options: ["Rainforest", "Desert", "Ocean", "Arctic"],
  correctAnswer: "Arctic",
  keywords: "nature ecosystem arctic polar bears"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to kangaroos?",
  options: ["Rainforest", "Desert", "Ocean", "Grassland"],
  correctAnswer: "Grassland",
  keywords: "nature ecosystem grassland kangaroos"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to coral reefs?",
  options: ["Rainforest", "Desert", "Ocean", "Grassland"],
  correctAnswer: "Ocean",
  keywords: "nature ecosystem ocean coral reefs"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to penguins?",
  options: ["Rainforest", "Desert", "Ocean", "Antarctica"],
  correctAnswer: "Antarctica",
  keywords: "nature ecosystem antarctica penguins"
},
{
  category: "kids",
  type: "quiz",
  quizType: "nature quiz",
  question: "Which ecosystem is home to lions?",
  options: ["Rainforest", "Desert", "Ocean", "Savanna"],
  correctAnswer: "Savanna",
  keywords: "nature ecosystem savanna lions"
}
];
