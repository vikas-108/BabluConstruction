const MATH_FORMULAS = [
  {
    category: "math",
    name: "Volume of Cube",
    formula: "V = a³",
    explanation: "Volume of a cube is side multiplied by itself three times.",
    image: "media/photos/hello.jpg",
    keywords: "volume of cube cube formula"
  },
  {
    category: "math",
    name: "Pythagoras Theorem",
    formula: "c² = a² + b²",
    explanation: "In a right-angled triangle, square of hypotenuse equals sum of squares of other two sides.",
    image: "images/formulas/pythagoras.png",
    keywords: "pythagoras theorem right triangle formula"
  },
  {
    category: "math",
    name: "Simple Interest",
    formula: "SI = (P × R × T) / 100",
    explanation: "Simple Interest is calculated on principal amount for a given time.",
    image: "images/formulas/simple-interest.png",
    keywords: "simple interest formula maths finance"
  },
  {
    category: "math",
    name: "Volume of Cylinder",
    formula: "V = π × r² × h",
    explanation: "Volume of a cylinder is area of base multiplied by height.",
    image: "media/photos/fun.jpg",
    keywords: "volume cylinder formula"
  },
  {
    category: "math",
    name: "Surface Area of Sphere",
    formula: "A = 4πr²",
    explanation: "Surface area of a sphere depends on radius.",
    image: "images/formulas/surface-sphere.png",
    keywords: "surface area sphere formula"
  },
  {
    category: "math",
    name: "Trapezium Area",
    formula: "A = ½ × (a + b) × h",
    explanation: "Area of trapezium is half of sum of parallel sides multiplied by height.",
    image: "images/formulas/trapezium.png",
    keywords: "trapezium area formula"
  },
  {
    category: "math",
    name: "Area of Triangle",
    formula: "A = ½ × b × h",
    explanation: "Area of triangle is half of base multiplied by height.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Triangle_area.svg/512px-Triangle_area.svg.png",
    keywords: "area triangle formula base height"
  },
  {
    category: "math",
    name: "Quadratic Formula",
    formula: "x = (−b ± √(b² − 4ac)) / 2a",
    explanation: "Used to find roots of a quadratic equation.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Quadratic_formula.svg/512px-Quadratic_formula.svg.png",
    keywords: "quadratic formula roots equation"
  },
  {
    category: "math",
    name: "Distance Formula",
    formula: "d = √[(x₂ − x₁)² + (y₂ − y₁)²]",
    explanation: "Distance between two points in coordinate geometry.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Distance_formula.svg/512px-Distance_formula.svg.png",
    keywords: "distance formula coordinate geometry"
  },
  /* =========================
   BASIC ARITHMETIC
========================= */
{
  category: "math",
  group: "Arithmetic",
  name: "Addition",
  formula: "a + b",
  explanation: "Addition combines two or more numbers into a single total.",
  image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Addition.svg",
  keywords: "addition sum plus arithmetic"
},
{
  category: "math",
  group: "Arithmetic",
  name: "Subtraction",
  formula: "a − b",
  explanation: "Subtraction finds the difference between two numbers.",
  image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Subtraction.svg",
  keywords: "subtraction minus difference arithmetic"
},
{
  category: "math",
  group: "Arithmetic",
  name: "Multiplication",
  formula: "a × b",
  explanation: "Multiplication is repeated addition of a number.",
  image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Multiplication.svg",
  keywords: "multiplication product times arithmetic"
},
{
  category: "math",
  group: "Arithmetic",
  name: "Division",
  formula: "a ÷ b",
  explanation: "Division splits a number into equal parts.",
  image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Division.svg",
  keywords: "division quotient arithmetic"
},

/* =========================
   GEOMETRY – AREA
========================= */
{
  category: "math",
  group: "Geometry (Area)",
  name: "Area of Square",
  formula: "A = a²",
  explanation: "Area of a square is side multiplied by itself.",
  image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Square_area.svg",
  keywords: "area square geometry"
},
{
  category: "math",
  group: "Geometry (Area)",
  name: "Area of Rectangle",
  formula: "A = l × b",
  explanation: "Area of rectangle is length multiplied by breadth.",
  image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Rectangle_area.svg",
  keywords: "area rectangle geometry"
},
{
  category: "math",
  group: "Geometry (Area)",
  name: "Area of Circle",
  formula: "A = πr²",
  explanation: "Area of a circle depends on the radius.",
  image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Circle_area.svg",
  keywords: "area circle pi geometry"
},

/* =========================
   GEOMETRY – PERIMETER
========================= */
{
  category: "math",
  group: "Geometry (Perimeter)",
  name: "Perimeter of Square",
  formula: "P = 4a",
  explanation: "Perimeter is sum of all sides of a square.",
  image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Square_perimeter.svg",
  keywords: "perimeter square"
},
{
  category: "math",
  group: "Geometry (Perimeter)",
  name: "Circumference of Circle",
  formula: "C = 2πr",
  explanation: "Circumference is the boundary length of a circle.",
  image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Circle_circumference.svg",
  keywords: "circumference circle pi"
},

/* =========================
   VOLUME & SURFACE AREA
========================= */
{
  category: "math",
  group: "Mensuration",
  name: "Volume of Cube",
  formula: "V = a³",
  explanation: "Volume of cube is side cubed.",
  image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Cube_volume.svg",
  keywords: "volume cube mensuration"
},
{
  category: "math",
  group: "Mensuration",
  name: "Volume of Cylinder",
  formula: "V = πr²h",
  explanation: "Volume of cylinder equals base area times height.",
  image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Cylinder_volume.svg",
  keywords: "volume cylinder"
},
{
  category: "math",
  group: "Mensuration",
  name: "Surface Area of Sphere",
  formula: "A = 4πr²",
  explanation: "Surface area of sphere depends on radius.",
  image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sphere_surface_area.svg",
  keywords: "surface area sphere"
},

/* =========================
   ALGEBRA
========================= */
{
  category: "math",
  group: "Algebra",
  name: "Quadratic Formula",
  formula: "x = (−b ± √(b² − 4ac)) / 2a",
  explanation: "Used to find roots of quadratic equations.",
  image: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Quadratic_formula.svg",
  keywords: "quadratic formula algebra"
},
{
  category: "math",
  group: "Algebra",
  name: "Linear Equation",
  formula: "ax + b = 0",
  explanation: "Simplest form of algebraic equation.",
  image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Linear_equation.svg",
  keywords: "linear equation algebra"
},

/* =========================
   TRIGONOMETRY
========================= */
{
  category: "math",
  group: "Trigonometry",
  name: "Sine",
  formula: "sinθ = opposite / hypotenuse",
  explanation: "Sine ratio in a right-angled triangle.",
  image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Trigonometry_triangle.svg",
  keywords: "sine trigonometry"
},
{
  category: "math",
  group: "Trigonometry",
  name: "Cosine",
  formula: "cosθ = adjacent / hypotenuse",
  explanation: "Cosine ratio in a right-angled triangle.",
  image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Trigonometry_triangle.svg",
  keywords: "cosine trigonometry"
},
{
  category: "math",
  group: "Trigonometry",
  name: "Tangent",
  formula: "tanθ = opposite / adjacent",
  explanation: "Tangent ratio in a right-angled triangle.",
  image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Trigonometry_triangle.svg",
  keywords: "tangent trigonometry"
},

/* =========================
   COORDINATE GEOMETRY
========================= */
{
  category: "math",
  group: "Coordinate Geometry",
  name: "Distance Formula",
  formula: "d = √[(x₂ − x₁)² + (y₂ − y₁)²]",
  explanation: "Distance between two points in XY plane.",
  image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Distance_formula.svg",
  keywords: "distance formula coordinate geometry"
},
{
  category: "math",
  group: "Coordinate Geometry",
  name: "Midpoint Formula",
  formula: "((x₁+x₂)/2 , (y₁+y₂)/2)",
  explanation: "Finds midpoint between two points.",
  image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Midpoint_formula.svg",
  keywords: "midpoint formula coordinate"
},

/* =========================
   FINANCIAL MATHEMATICS
========================= */
{
  category: "math",
  group: "Finance",
  name: "Simple Interest",
  formula: "SI = (P × R × T) / 100",
  explanation: "Interest calculated on principal amount.",
  image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Simple_interest.svg",
  keywords: "simple interest finance"
},
{
  category: "math",
  group: "Finance",
  name: "Compound Interest",
  formula: "CI = P(1 + R/100)ᵗ − P",
  explanation: "Interest calculated on accumulated amount.",
  image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Compound_interest.svg",
  keywords: "compound interest finance"
},
{
    category: "math",
    group: "Calculus",
    name: "Derivative of xⁿ",
    formula: "d/dx (xⁿ) = n xⁿ⁻¹",
    explanation: "Power rule of differentiation.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Power_rule.svg",
    keywords: "derivative power rule"
  },
  {
    category: "math",
    group: "Calculus",
    name: "∫ xⁿ dx",
    formula: "xⁿ⁺¹ / (n+1) + C",
    explanation: "Power rule of integration.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Integral_power_rule.svg",
    keywords: "integration calculus"
  }
];
