const THEORY_DATA = [
{
  question: "what is slab shuttering?",
  keywords: "slab shuttering formwork rcc",
  answer: `
    <strong>Slab shuttering</strong> is a temporary structure used to support
    fresh concrete until it gains sufficient strength.
    <br><br>
    It includes wooden or steel plates, props, and beams used in RCC slab construction.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Maintain slab shape</li>
      <li>Support wet concrete</li>
      <li>Ensure safety and quality</li>
    </ul>
  `
},

{
  question: "what is curing in concrete?",
  keywords: "concrete curing hydration strength",
  answer: `
    <strong>Curing</strong> is the process of maintaining adequate moisture,
    temperature, and time to allow concrete to achieve its desired strength.
    <br><br>
    Methods include water curing, membrane curing, and steam curing.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Ensure proper hydration</li>
      <li>Increase strength and durability</li>
      <li>Reduce cracks and shrinkage</li>
    </ul>
  `
},

{
  question: "what is reinforcement in RCC?",
  keywords: "reinforcement steel bars rcc",
  answer: `
    <strong>Reinforcement</strong> refers to steel bars or mesh embedded in concrete
    to resist tensile stresses.
    <br><br>
    It works with concrete to form Reinforced Cement Concrete (RCC).
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide tensile strength</li>
      <li>Prevent cracking</li>
      <li>Improve structural stability</li>
    </ul>
  `
},

{
  question: "what is footing in construction?",
  keywords: "footing foundation load bearing",
  answer: `
    <strong>Footing</strong> is the bottom part of a foundation that distributes
    building loads to the soil.
    <br><br>
    Types include isolated footing, combined footing, and raft footing.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Transfer load safely to soil</li>
      <li>Prevent settlement</li>
      <li>Ensure stability of structure</li>
    </ul>
  `
},

{
  question: "what is plastering?",
  keywords: "plastering wall finish construction",
  answer: `
    <strong>Plastering</strong> is the process of covering rough surfaces of walls
    and ceilings with a smooth layer of plaster.
    <br><br>
    Materials used include cement plaster, lime plaster, or gypsum plaster.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide smooth finish</li>
      <li>Protect surface from weather</li>
      <li>Improve aesthetics</li>
    </ul>
  `
},

{
  question: "what is scaffolding?",
  keywords: "scaffolding temporary structure construction",
  answer: `
    <strong>Scaffolding</strong> is a temporary structure used to support workers
    and materials during construction, repair, or maintenance.
    <br><br>
    It is usually made of steel tubes or bamboo.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide safe working platform</li>
      <li>Enable access to heights</li>
      <li>Support materials and tools</li>
    </ul>
  `
},
  {
    question: "why soil filling is required?",
    keywords: "soil filling foundation leveling",
    answer: `
      Soil filling is required to <strong>level the ground</strong> and
      <strong>increase foundation stability</strong>.
      <br><br>
      Proper compaction prevents:
      <ul>
        <li>Foundation settlement</li>
        <li>Cracks in structure</li>
        <li>Water accumulation</li>
      </ul>
    `
  },
  {
    question: "difference between cement and concrete?",
    keywords: "cement vs concrete material",
    answer: `
      <strong>Cement</strong> is a binding material, while
      <strong>concrete</strong> is a mixture of cement, sand, aggregate, and water.
      <br><br>
      Cement alone is not used for construction structures.
    `
  },
  // -------------------- CONCRETE --------------------
{
  question: "what is concrete mix design?",
  keywords: "concrete mix design ratio strength",
  answer: `
    <strong>Concrete mix design</strong> is the process of selecting suitable
    proportions of cement, sand, aggregates, and water to achieve desired strength.
    <br><br>
    Common mixes: M20 (1:1.5:3), M25, M30 etc.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Ensure required strength</li>
      <li>Optimize material usage</li>
      <li>Improve durability</li>
    </ul>
  `
},

{
  question: "what is curing in concrete?",
  keywords: "concrete curing hydration strength",
  answer: `
    <strong>Curing</strong> is maintaining moisture and temperature in concrete
    to allow proper hydration.
    <br><br>
    Methods: water curing, membrane curing, steam curing.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Increase strength</li>
      <li>Reduce shrinkage cracks</li>
      <li>Enhance durability</li>
    </ul>
  `
},

// -------------------- MASONRY --------------------
{
  question: "what is brick masonry?",
  keywords: "brick masonry wall construction",
  answer: `
    <strong>Brick masonry</strong> is construction using bricks bonded with mortar.
    <br><br>
    Types: English bond, Flemish bond.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Form walls and partitions</li>
      <li>Provide strength and stability</li>
      <li>Offer fire resistance</li>
    </ul>
  `
},

{
  question: "what is stone masonry?",
  keywords: "stone masonry rubble ashlar",
  answer: `
    <strong>Stone masonry</strong> uses stones bonded with mortar for walls and foundations.
    <br><br>
    Types: rubble masonry, ashlar masonry.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide durability</li>
      <li>Resist weathering</li>
      <li>Offer aesthetic appeal</li>
    </ul>
  `
},

// -------------------- STRUCTURAL ELEMENTS --------------------
{
  question: "what are beams in construction?",
  keywords: "beam rcc structural element",
  answer: `
    <strong>Beams</strong> are horizontal structural members that transfer loads
    from slabs to columns.
    <br><br>
    Types: simply supported, cantilever, continuous.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Carry bending loads</li>
      <li>Support slabs and roofs</li>
      <li>Distribute loads to columns</li>
    </ul>
  `
},

{
  question: "what are columns in construction?",
  keywords: "column rcc load bearing",
  answer: `
    <strong>Columns</strong> are vertical structural members that transfer loads
    from beams and slabs to foundations.
    <br><br>
    Types: tied column, spiral column, composite column.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Carry axial loads</li>
      <li>Provide stability</li>
      <li>Prevent buckling</li>
    </ul>
  `
},

{
  question: "what is lintel?",
  keywords: "lintel beam opening support",
  answer: `
    <strong>Lintel</strong> is a horizontal member placed above doors and windows
    to support loads above openings.
    <br><br>
    Materials: RCC, steel, timber, stone.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Transfer load around openings</li>
      <li>Prevent cracks</li>
      <li>Maintain structural integrity</li>
    </ul>
  `
},

{
  question: "what is slab in construction?",
  keywords: "slab rcc horizontal member",
  answer: `
    <strong>Slab</strong> is a flat horizontal structural element forming floors
    and roofs.
    <br><br>
    Types: one-way slab, two-way slab, flat slab.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide working surface</li>
      <li>Distribute loads</li>
      <li>Form ceilings and roofs</li>
    </ul>
  `
},

// -------------------- FOUNDATIONS --------------------
{
  question: "what is shallow foundation?",
  keywords: "shallow foundation footing",
  answer: `
    <strong>Shallow foundation</strong> transfers building loads to soil at shallow depth.
    <br><br>
    Types: isolated footing, combined footing, raft foundation.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Support light structures</li>
      <li>Distribute loads evenly</li>
      <li>Economical for small buildings</li>
    </ul>
  `
},

{
  question: "what is deep foundation?",
  keywords: "deep foundation pile caisson",
  answer: `
    <strong>Deep foundation</strong> transfers loads to deeper soil layers.
    <br><br>
    Types: pile foundation, caisson foundation.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Support heavy structures</li>
      <li>Bypass weak soil layers</li>
      <li>Provide stability</li>
    </ul>
  `
},

// -------------------- FINISHES --------------------
{
  question: "what is plastering?",
  keywords: "plastering wall finish construction",
  answer: `
    <strong>Plastering</strong> is covering rough surfaces with smooth plaster.
    <br><br>
    Materials: cement plaster, lime plaster, gypsum plaster.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide smooth finish</li>
      <li>Protect walls</li>
      <li>Improve aesthetics</li>
    </ul>
  `
},

{
  question: "what is painting in construction?",
  keywords: "painting wall finish protection",
  answer: `
    <strong>Painting</strong> is applying paint to surfaces for protection and aesthetics.
    <br><br>
    Types: oil paint, emulsion paint, distemper.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Protect surfaces from weather</li>
      <li>Enhance appearance</li>
      <li>Increase durability</li>
    </ul>
  `
},

// -------------------- SITE WORKS --------------------
{
  question: "what is scaffolding?",
  keywords: "scaffolding temporary structure construction",
  answer: `
    <strong>Scaffolding</strong> is a temporary structure used to support workers
    and materials during construction.
    <br><br>
    Types: single scaffolding, double scaffolding, cantilever scaffolding.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide safe working platform</li>
      <li>Enable access to heights</li>
      <li>Support materials</li>
    </ul>
  `
},

{
  question: "what is formwork?",
  keywords: "formwork shuttering concrete",
  answer: `
    <strong>Formwork</strong> is a temporary mold used to hold fresh concrete
    until it sets.
    <br><br>
    Materials: timber, steel, aluminum, plastic.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Shape concrete elements</li>
      <li>Support wet concrete</li>
      <li>Ensure quality finish</li>
    </ul>
  `
},
// -------------------- ROOFS --------------------
{
  question: "what are types of roofs in construction?",
  keywords: "roof types flat pitched truss",
  answer: `
    <strong>Roofs</strong> are structural coverings that protect buildings from weather.
    <br><br>
    Common types:
    <ul>
      <li>Flat roof</li>
      <li>Pitched roof</li>
      <li>Truss roof</li>
      <li>Shell roof</li>
    </ul>
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide shelter</li>
      <li>Drain rainwater</li>
      <li>Support insulation</li>
    </ul>
  `
},

{
  question: "what is a pitched roof?",
  keywords: "pitched roof slope gable hip",
  answer: `
    <strong>Pitched roof</strong> has a sloping surface to drain rainwater quickly.
    <br><br>
    Types: gable roof, hip roof, shed roof.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Prevent water leakage</li>
      <li>Allow attic space</li>
      <li>Improve aesthetics</li>
    </ul>
  `
},

// -------------------- FLOORING --------------------
{
  question: "what are types of flooring systems?",
  keywords: "flooring systems concrete tile wood",
  answer: `
    <strong>Flooring systems</strong> provide a durable walking surface inside buildings.
    <br><br>
    Common types:
    <ul>
      <li>Cement concrete flooring</li>
      <li>Tile flooring</li>
      <li>Wooden flooring</li>
      <li>Marble flooring</li>
      <li>Terrazzo flooring</li>
    </ul>
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide smooth surface</li>
      <li>Enhance aesthetics</li>
      <li>Ensure durability</li>
    </ul>
  `
},

{
  question: "what is terrazzo flooring?",
  keywords: "terrazzo flooring marble chips cement",
  answer: `
    <strong>Terrazzo flooring</strong> is made by mixing marble chips with cement
    and polishing the surface.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide decorative finish</li>
      <li>Offer durability</li>
      <li>Easy maintenance</li>
    </ul>
  `
},

// -------------------- BUILDING SERVICES --------------------
{
  question: "what is plumbing in construction?",
  keywords: "plumbing water supply drainage",
  answer: `
    <strong>Plumbing</strong> is the system of pipes, fixtures, and fittings
    for water supply and drainage.
    <br><br>
    Components: water supply lines, drainage pipes, sanitary fittings.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Provide clean water</li>
      <li>Dispose wastewater</li>
      <li>Maintain hygiene</li>
    </ul>
  `
},

{
  question: "what is electrical wiring in buildings?",
  keywords: "electrical wiring circuits safety",
  answer: `
    <strong>Electrical wiring</strong> is the network of wires, switches, and
    circuits that distribute electricity in buildings.
    <br><br>
    Types: concealed wiring, surface wiring.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Supply power to appliances</li>
      <li>Ensure safety</li>
      <li>Enable lighting and equipment</li>
    </ul>
  `
},

{
  question: "what is HVAC in construction?",
  keywords: "hvac heating ventilation air conditioning",
  answer: `
    <strong>HVAC</strong> stands for Heating, Ventilation, and Air Conditioning.
    <br><br>
    It controls indoor climate and air quality.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Maintain comfortable temperature</li>
      <li>Ensure fresh air circulation</li>
      <li>Control humidity</li>
    </ul>
  `
},

// -------------------- SAFETY PRACTICES --------------------
{
  question: "what are safety practices in construction?",
  keywords: "construction safety helmet ppe",
  answer: `
    <strong>Safety practices</strong> are measures to protect workers and
    equipment during construction.
    <br><br>
    Common practices:
    <ul>
      <li>Use of PPE (helmets, gloves, boots)</li>
      <li>Proper scaffolding</li>
      <li>Safe electrical wiring</li>
      <li>Fire safety measures</li>
    </ul>
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Prevent accidents</li>
      <li>Ensure worker health</li>
      <li>Comply with regulations</li>
    </ul>
  `
},

{
  question: "what is PPE in construction?",
  keywords: "ppe personal protective equipment safety",
  answer: `
    <strong>PPE</strong> stands for Personal Protective Equipment used by workers
    to minimize exposure to hazards.
    <br><br>
    Examples: helmets, gloves, safety shoes, goggles, ear protection.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Protect against injuries</li>
      <li>Ensure compliance with safety standards</li>
      <li>Improve workplace safety</li>
    </ul>
  `
},

{
  question: "what is fire safety in construction?",
  keywords: "fire safety extinguisher evacuation",
  answer: `
    <strong>Fire safety</strong> involves measures to prevent and respond to fire hazards.
    <br><br>
    Includes fire extinguishers, alarms, sprinklers, and evacuation plans.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Protect lives</li>
      <li>Prevent property damage</li>
      <li>Ensure emergency preparedness</li>
    </ul>
  `
},
// -------------------- MODERN CONSTRUCTION TECHNOLOGIES --------------------
{
  question: "what is prefabrication in construction?",
  keywords: "prefabrication modular construction off-site",
  answer: `
    <strong>Prefabrication</strong> is the process of manufacturing building components
    off-site and assembling them on-site.
    <br><br>
    Examples: modular homes, precast concrete panels, steel frames.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Reduce construction time</li>
      <li>Improve quality control</li>
      <li>Lower labor costs</li>
    </ul>
  `
},

{
  question: "what is green building?",
  keywords: "green building sustainable eco-friendly",
  answer: `
    <strong>Green building</strong> refers to designing and constructing structures
    that are environmentally responsible and resource-efficient.
    <br><br>
    Features: energy-efficient lighting, rainwater harvesting, solar panels.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Reduce environmental impact</li>
      <li>Improve energy efficiency</li>
      <li>Enhance occupant health</li>
    </ul>
  `
},

{
  question: "what are smart homes?",
  keywords: "smart home automation iot",
  answer: `
    <strong>Smart homes</strong> use IoT devices and automation systems to control
    lighting, security, HVAC, and appliances.
    <br><br>
    Examples: smart thermostats, voice-controlled assistants, automated locks.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Increase convenience</li>
      <li>Improve energy efficiency</li>
      <li>Enhance security</li>
    </ul>
  `
},

{
  question: "what are sustainable materials in construction?",
  keywords: "sustainable materials bamboo recycled concrete",
  answer: `
    <strong>Sustainable materials</strong> are eco-friendly resources used in construction
    to minimize environmental impact.
    <br><br>
    Examples: bamboo, recycled concrete, fly ash bricks, reclaimed wood.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Reduce carbon footprint</li>
      <li>Promote recycling and reuse</li>
      <li>Support long-term sustainability</li>
    </ul>
  `
},

{
  question: "what is BIM in construction?",
  keywords: "BIM building information modeling digital twin",
  answer: `
    <strong>BIM (Building Information Modeling)</strong> is a digital representation
    of physical and functional characteristics of a building.
    <br><br>
    It integrates design, construction, and operation data into one model.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Improve collaboration</li>
      <li>Detect design conflicts early</li>
      <li>Enhance project efficiency</li>
    </ul>
  `
},

{
  question: "what is net-zero building?",
  keywords: "net zero building energy efficiency",
  answer: `
    <strong>Net-zero building</strong> produces as much energy as it consumes
    through renewable sources.
    <br><br>
    Features: solar panels, efficient insulation, energy storage systems.
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Achieve energy independence</li>
      <li>Reduce greenhouse gas emissions</li>
      <li>Promote sustainability</li>
    </ul>
  `
},
// -------------------- हिंदी प्रश्न --------------------
{
  question: "स्लैब शटरिंग क्या है?",
  keywords: "स्लैब शटरिंग फॉर्मवर्क आरसीसी",
  answer: `
    <strong>स्लैब शटरिंग</strong> एक अस्थायी ढांचा है जो ताज़ा कंक्रीट को
    तब तक सहारा देता है जब तक वह पर्याप्त मज़बूती हासिल न कर ले।
    <br><br>
    इसमें लकड़ी या स्टील प्लेटें, प्रॉप्स और बीम शामिल होते हैं।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>स्लैब का आकार बनाए रखना</li>
      <li>गीले कंक्रीट को सहारा देना</li>
      <li>सुरक्षा और गुणवत्ता सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/slab-shuttering.jpg" alt="Slab Shuttering Image" />
  `
},

{
  question: "ईंट की चिनाई क्या है?",
  keywords: "ईंट चिनाई दीवार निर्माण",
  answer: `
    <strong>ईंट की चिनाई</strong> ईंटों और गारे का उपयोग करके दीवार बनाने की प्रक्रिया है।
    <br><br>
    प्रकार: इंग्लिश बॉन्ड, फ्लेमिश बॉन्ड।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>दीवार और पार्टिशन बनाना</li>
      <li>मज़बूती और स्थिरता प्रदान करना</li>
      <li>अग्नि प्रतिरोध देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/brick-masonry.jpg" alt="Brick Masonry Image" />
  `
},

{
  question: "प्लास्टरिंग क्या है?",
  keywords: "प्लास्टरिंग दीवार फिनिश निर्माण",
  answer: `
    <strong>प्लास्टरिंग</strong> दीवारों और छत की सतह को चिकना बनाने की प्रक्रिया है।
    <br><br>
    सामग्री: सीमेंट प्लास्टर, चूना प्लास्टर, जिप्सम प्लास्टर।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>सतह को चिकना करना</li>
      <li>दीवारों को मौसम से बचाना</li>
      <li>सौंदर्य बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/plastering.jpg" alt="Plastering Image" />
  `
},

{
  question: "सुरक्षा उपकरण (PPE) क्या हैं?",
  keywords: "पीपीई सुरक्षा उपकरण निर्माण",
  answer: `
    <strong>PPE</strong> यानी व्यक्तिगत सुरक्षा उपकरण, निर्माण कार्य में
    मज़दूरों को चोटों से बचाने के लिए उपयोग किए जाते हैं।
    <br><br>
    उदाहरण: हेलमेट, दस्ताने, सुरक्षा जूते, चश्मा।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>चोटों से बचाव</li>
      <li>सुरक्षा मानकों का पालन</li>
      <li>कार्यस्थल की सुरक्षा बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/ppe-construction.jpg" alt="PPE Image" />
  `
},
// -------------------- कंक्रीट (Concrete) --------------------
{
  question: "कंक्रीट मिक्स डिज़ाइन क्या है?",
  keywords: "कंक्रीट मिक्स डिज़ाइन अनुपात मज़बूती",
  answer: `
    <strong>कंक्रीट मिक्स डिज़ाइन</strong> सीमेंट, रेत, एग्रीगेट और पानी के
    अनुपात को चुनने की प्रक्रिया है ताकि आवश्यक मज़बूती प्राप्त हो सके।
    <br><br>
    सामान्य मिक्स: M20 (1:1.5:3), M25, M30।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>आवश्यक मज़बूती सुनिश्चित करना</li>
      <li>सामग्री का सही उपयोग</li>
      <li>टिकाऊपन बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/concrete-mix.jpg" alt="Concrete Mix Design Image" />
  `
},

// -------------------- चिनाई (Masonry) --------------------
{
  question: "पत्थर की चिनाई क्या है?",
  keywords: "पत्थर चिनाई रबल ऐशलर",
  answer: `
    <strong>पत्थर की चिनाई</strong> पत्थरों और गारे का उपयोग करके दीवार या नींव
    बनाने की प्रक्रिया है।
    <br><br>
    प्रकार: रबल चिनाई, ऐशलर चिनाई।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>टिकाऊपन प्रदान करना</li>
      <li>मौसम से बचाव</li>
      <li>सौंदर्य बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/stone-masonry.jpg" alt="Stone Masonry Image" />
  `
},

// -------------------- संरचनात्मक तत्व (Structural Elements) --------------------
{
  question: "बीम क्या है?",
  keywords: "बीम आरसीसी संरचनात्मक तत्व",
  answer: `
    <strong>बीम</strong> क्षैतिज संरचनात्मक सदस्य है जो स्लैब से भार को कॉलम तक पहुँचाता है।
    <br><br>
    प्रकार: साधारण बीम, कैंटिलीवर बीम, निरंतर बीम।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>झुकाव भार वहन करना</li>
      <li>स्लैब और छत को सहारा देना</li>
      <li>भार को कॉलम तक पहुँचाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/beam.jpg" alt="Beam Image" />
  `
},

// -------------------- नींव (Foundations) --------------------
{
  question: "पाइल नींव क्या है?",
  keywords: "पाइल नींव गहरी नींव",
  answer: `
    <strong>पाइल नींव</strong> गहरी नींव का प्रकार है जिसमें लंबे स्तंभ जैसे
    सदस्य मिट्टी में गाड़े जाते हैं।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>भारी संरचनाओं को सहारा देना</li>
      <li>कमज़ोर मिट्टी को पार करना</li>
      <li>स्थिरता सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/pile-foundation.jpg" alt="Pile Foundation Image" />
  `
},

// -------------------- फिनिशिंग (Finishes) --------------------
{
  question: "पेंटिंग क्या है?",
  keywords: "पेंटिंग दीवार फिनिश सुरक्षा",
  answer: `
    <strong>पेंटिंग</strong> सतह पर रंग लगाने की प्रक्रिया है जिससे सुरक्षा और
    सौंदर्य दोनों मिलते हैं।
    <br><br>
    प्रकार: ऑयल पेंट, इमल्शन पेंट, डिस्टेम्पर।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>सतह को मौसम से बचाना</li>
      <li>सौंदर्य बढ़ाना</li>
      <li>टिकाऊपन बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/painting.jpg" alt="Painting Image" />
  `
},

// -------------------- साइट कार्य (Site Works) --------------------
{
  question: "मचान (Scaffolding) क्या है?",
  keywords: "मचान अस्थायी संरचना निर्माण",
  answer: `
    <strong>मचान</strong> अस्थायी संरचना है जो निर्माण कार्य के दौरान मज़दूरों और
    सामग्री को सहारा देती है।
    <br><br>
    प्रकार: सिंगल मचान, डबल मचान, कैंटिलीवर मचान।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>सुरक्षित कार्य प्लेटफ़ॉर्म देना</li>
      <li>ऊँचाई तक पहुँचाना</li>
      <li>सामग्री को सहारा देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/scaffolding.jpg" alt="Scaffolding Image" />
  `
},

// -------------------- छत (Roofs) --------------------
{
  question: "ढलवाँ छत (Pitched Roof) क्या है?",
  keywords: "ढलवाँ छत गेब्ल हिप",
  answer: `
    <strong>ढलवाँ छत</strong> में ढलान होती है जिससे वर्षा का पानी आसानी से निकल जाता है।
    <br><br>
    प्रकार: गेब्ल छत, हिप छत, शेड छत।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>पानी का रिसाव रोकना</li>
      <li>अटारी स्थान देना</li>
      <li>सौंदर्य बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/pitched-roof.jpg" alt="Pitched Roof Image" />
  `
},

// -------------------- फ़्लोरिंग (Flooring) --------------------
{
  question: "टेराज़ो फ़्लोरिंग क्या है?",
  keywords: "टेराज़ो फ़्लोरिंग संगमरमर चिप्स सीमेंट",
  answer: `
    <strong>टेराज़ो फ़्लोरिंग</strong> संगमरमर के चिप्स और सीमेंट से बनी होती है,
    जिसे पॉलिश करके चिकना किया जाता है।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>सजावटी फिनिश देना</li>
      <li>टिकाऊपन प्रदान करना</li>
      <li>आसान रखरखाव</li>
    </ul>
    <br><br>
    <img src="https://example.com/terrazzo-flooring.jpg" alt="Terrazzo Flooring Image" />
  `
},

// -------------------- सेवाएँ (Services) --------------------
{
  question: "प्लंबिंग क्या है?",
  keywords: "प्लंबिंग जल आपूर्ति ड्रेनेज",
  answer: `
    <strong>प्लंबिंग</strong> पाइप, फिटिंग और उपकरणों का नेटवर्क है जो जल आपूर्ति
    और ड्रेनेज सुनिश्चित करता है।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>स्वच्छ पानी उपलब्ध कराना</li>
      <li>गंदे पानी का निस्तारण</li>
      <li>स्वच्छता बनाए रखना</li>
    </ul>
    <br><br>
    <img src="https://example.com/plumbing.jpg" alt="Plumbing Image" />
  `
},

// -------------------- सुरक्षा (Safety) --------------------
{
  question: "निर्माण में सुरक्षा उपकरण (PPE) क्या हैं?",
  keywords: "पीपीई सुरक्षा उपकरण निर्माण",
  answer: `
    <strong>PPE</strong> यानी व्यक्तिगत सुरक्षा उपकरण, निर्माण कार्य में
    मज़दूरों को चोटों से बचाने के लिए उपयोग किए जाते हैं।
    <br><br>
    उदाहरण: हेलमेट, दस्ताने, सुरक्षा जूते, चश्मा।
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>चोटों से बचाव</li>
      <li>सुरक्षा मानकों का पालन</li>
      <li>कार्यस्थल की सुरक्षा बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/ppe-construction.jpg" alt="PPE Image" />
  `
},
// -------------------- MACHINERY --------------------
{
  question: "what is a concrete mixer?",
  keywords: "concrete mixer machine mixing",
  image:"images/design/polo.png",
  answer: `
    <strong>Concrete mixer</strong> is a machine that mixes cement, sand, aggregates,
    and water uniformly to produce concrete.
    <br><br>
    <strong>Working:</strong> A rotating drum blends materials until a homogeneous mix is achieved.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Ensure uniform concrete mix</li>
      <li>Save labor time</li>
      <li>Improve quality and consistency</li>
    </ul>
    <br><br>
  `
},
{
  question: "कंक्रीट मिक्सर मशीन क्या है?",
  keywords: "कंक्रीट मिक्सर मशीन मिश्रण",
  image:"https://example.com/concrete-mixer.jpg",
  answer: `
    <strong>कंक्रीट मिक्सर</strong> एक मशीन है जो सीमेंट, रेत, एग्रीगेट और पानी
    को समान रूप से मिलाती है।
    <br><br>
    <strong>कार्य:</strong> घूमने वाला ड्रम सभी सामग्री को मिलाकर एकसमान मिश्रण बनाता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>समान मिश्रण सुनिश्चित करना</li>
      <li>मज़दूरी समय बचाना</li>
      <li>गुणवत्ता और स्थिरता बढ़ाना</li>
    </ul>
    <br><br>
  `
},

{
  question: "what is a bulldozer?",
  keywords: "bulldozer earthmoving machine",
  image:"media/photos/bull12.jpg",
  answer: `
    <strong>Bulldozer</strong> is a heavy earthmoving machine with a large blade
    used to push soil, sand, rubble, or debris.
    <br><br>
    <strong>Working:</strong> The front blade moves material by pushing it forward
    while tracks provide stability.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Clear land for construction</li>
      <li>Level ground</li>
      <li>Remove debris</li>
    </ul>
    <br><br>
  `
},
{
  question: "बुलडोज़र क्या है?",
  keywords: "बुलडोज़र मिट्टी हटाने मशीन",
  image:"media/photos/bull.jpg",
  answer: `
    <strong>बुलडोज़र</strong> एक भारी मशीन है जिसमें बड़ा ब्लेड होता है जो मिट्टी,
    रेत या मलबे को धकेलने के लिए उपयोग होता है।
    <br><br>
    <strong>कार्य:</strong> सामने का ब्लेड सामग्री को आगे धकेलता है और ट्रैक मशीन को स्थिर रखते हैं।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>निर्माण स्थल साफ करना</li>
      <li>ज़मीन समतल करना</li>
      <li>मलबा हटाना</li>
    </ul>
    <br><br>
  `
},

{
  question: "what is an excavator?",
  keywords: "excavator digging machine",
   image:"media/photos/excvat.jpg",
  answer: `
    <strong>Excavator</strong> is a machine used for digging, trenching, and
    lifting heavy materials.
    <br><br>
    <strong>Working:</strong> A hydraulic arm with a bucket scoops soil and loads it into trucks.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Excavation for foundations</li>
      <li>Trenching for pipelines</li>
      <li>Material handling</li>
    </ul>
    <br><br> `
  },
{
  question: "एक्सकेवेटर क्या है?",
  keywords: "एक्सकेवेटर खुदाई मशीन",
  image:"media/photos/exc.jpg",
  answer: `
    <strong>एक्सकेवेटर</strong> एक मशीन है जिसका उपयोग खुदाई, ट्रेंचिंग और भारी
    सामग्री उठाने के लिए किया जाता है।
    <br><br>
    <strong>कार्य:</strong> हाइड्रोलिक आर्म और बकेट मिट्टी को खोदकर ट्रक में भरते हैं।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>नींव की खुदाई</li>
      <li>पाइपलाइन के लिए ट्रेंचिंग</li>
      <li>सामग्री उठाना और स्थानांतरित करना</li>
    </ul>
    <br><br>
  `
},

{
  question: "what is a tower crane?",
  keywords: "tower crane lifting machine",
  image:"media/photos/crane.png",
  answer: `
    <strong>Tower crane</strong> is a tall lifting machine used to move heavy
    materials vertically and horizontally on construction sites.
    <br><br>
    <strong>Working:</strong> A rotating jib and hoist lift loads and place them
    at required positions.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Lift heavy materials to height</li>
      <li>Speed up construction</li>
      <li>Ensure safe handling</li>
    </ul>
    <br><br>
  `
},
{
  question: "टॉवर क्रेन क्या है?",
  keywords: "टॉवर क्रेन उठाने मशीन",
  answer: `
    <strong>टॉवर क्रेन</strong> एक ऊँची मशीन है जो निर्माण स्थल पर भारी सामग्री
    को ऊँचाई तक उठाने और स्थानांतरित करने के लिए उपयोग होती है।
    <br><br>
    <strong>कार्य:</strong> घूमने वाला जिब और होइस्ट भार को उठाकर आवश्यक स्थान पर रखते हैं।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>भारी सामग्री को ऊँचाई तक उठाना</li>
      <li>निर्माण की गति बढ़ाना</li>
      <li>सुरक्षित हैंडलिंग सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/tower-crane.jpg" alt="Tower Crane Image" />
  `
},
// -------------------- CONSTRUCTION MACHINERY --------------------

// 1. Loader
{
  question: "what is a loader?",
  keywords: "loader machine earthmoving",
  image:"https://st.perplexity.ai/estatic/0b226c450798410ac541646c86ec31afd840e5beab817a5d84fa821e7db61981ec84c3b4a3f072a7a2e1899c9fb06c6ec8c2acbcedb68f577100a5a60f0a79b793baf4150c09e53c21a88e49c74fce827c0014d7155c3fb9cc123167fad9c2d0",
  answer: `
    <strong>Loader</strong> is a machine used to load materials like soil, sand,
    gravel into trucks or move them around the site.
    <br><br>
    <strong>Working:</strong> A front bucket scoops material and lifts it for transport.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Quick loading of materials</li>
      <li>Reduce manual labor</li>
      <li>Efficient site handling</li>
    </ul>
    <br><br>
  `
},
{
  question: "लोडर मशीन क्या है?",
  keywords: "लोडर मशीन मिट्टी लोडिंग",
  answer: `
    <strong>लोडर</strong> एक मशीन है जो मिट्टी, रेत, बजरी आदि को ट्रक में भरने
    या साइट पर स्थानांतरित करने के लिए उपयोग होती है।
    <br><br>
    <strong>कार्य:</strong> सामने का बकेट सामग्री को उठाकर ट्रक में डालता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>सामग्री जल्दी लोड करना</li>
      <li>मज़दूरी कम करना</li>
      <li>साइट पर कार्य क्षमता बढ़ाना</li>
    </ul>
    <br><br>
  `
},

// 2. Road Roller
{
  question: "what is a road roller?",
  keywords: "road roller compaction machine",
  image:"https://media.istockphoto.com/id/506691925/photo/road-roller-at-construction-site.jpg?s=612x612&w=0&k=20&c=TeRW72EpSupTYcEt8XivnpEvisvSaUkkcPRDi8aAcIQ=",
  answer: `
    <strong>Road roller</strong> is a compaction machine used to compress soil,
    gravel, concrete, or asphalt in road construction.
    <br><br>
    <strong>Working:</strong> Heavy cylindrical drums roll over the surface to compact it.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Increase soil density</li>
      <li>Provide smooth road surface</li>
      <li>Improve load-bearing capacity</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-roller.jpg" alt="Road Roller Image" />
  `
},
{
  question: "रोड रोलर क्या है?",
  keywords: "रोड रोलर संपीड़न मशीन",
  image:"https://image.made-in-china.com/365f3j00wGLvdWPcPmoA/China-Manufacturer-12-Ton-Full-Hydraulic-Compactor-Xs123-Road-Roller-Hot-Sale-in-Africa-in-Stock.webp",
  answer: `
    <strong>रोड रोलर</strong> एक मशीन है जो सड़क निर्माण में मिट्टी, बजरी,
    कंक्रीट या डामर को दबाने के लिए उपयोग होती है।
    <br><br>
    <strong>कार्य:</strong> भारी बेलनाकार ड्रम सतह पर घूमकर उसे संपीड़ित करते हैं।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>मिट्टी की घनत्व बढ़ाना</li>
      <li>सड़क की सतह को चिकना बनाना</li>
      <li>भार वहन क्षमता बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-roller.jpg" alt="Road Roller Image" />
  `
},

// 3. Dump Truck
{
  question: "what is a dump truck?",
  keywords: "dump truck material transport",
  image:"media/photos/load.jpg",
  answer: `
    <strong>Dump truck</strong> is a vehicle used to transport loose materials
    like sand, gravel, or demolition waste.
    <br><br>
    <strong>Working:</strong> Hydraulic system lifts the rear bed to unload materials.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Transport bulk materials</li>
      <li>Quick unloading</li>
      <li>Reduce manual handling</li>
    </ul>
    <br><br>
  `
},
{
  question: "डंप ट्रक क्या है?",
  keywords: "डंप ट्रक सामग्री परिवहन",
   image:"media/photos/loader.jpg",
  answer: `
    <strong>डंप ट्रक</strong> एक वाहन है जो रेत, बजरी या मलबे जैसी ढीली सामग्री
    को परिवहन करने के लिए उपयोग होता है।
    <br><br>
    <strong>कार्य:</strong> हाइड्रोलिक सिस्टम पीछे का बेड उठाकर सामग्री को उतार देता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>थोक सामग्री का परिवहन</li>
      <li>तेज़ी से उतारना</li>
      <li>मैनुअल हैंडलिंग कम करना</li>
    </ul>
    <br><br>
  `
},

// 4. Concrete Pump
{
  question: "what is a concrete pump?",
  keywords: "concrete pump machine",
  image:"media/photos/pumping.jpg",
  answer: `
    <strong>Concrete pump</strong> is a machine used to transfer liquid concrete
    to high or difficult-to-access areas.
    <br><br>
    <strong>Working:</strong> Hydraulic pumps push concrete through pipes and hoses.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Place concrete at heights</li>
      <li>Speed up pouring process</li>
      <li>Reduce manual effort</li>
    </ul>
    <br><br>
    <img src="https://example.com/concrete-pump.jpg" alt="Concrete Pump Image" />
  `
},
{
  question: "कंक्रीट पंप क्या है?",
  keywords: "कंक्रीट पंप मशीन",
  image:"media/photos/pump.jpg",
  answer: `
    <strong>कंक्रीट पंप</strong> एक मशीन है जो तरल कंक्रीट को ऊँचाई या कठिन
    स्थानों तक पहुँचाने के लिए उपयोग होती है।
    <br><br>
    <strong>कार्य:</strong> हाइड्रोलिक पंप पाइप और होज़ के माध्यम से कंक्रीट को धकेलते हैं।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>कंक्रीट को ऊँचाई तक पहुँचाना</li>
      <li>डालने की प्रक्रिया तेज़ करना</li>
      <li>मज़दूरी कम करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/concrete-pump.jpg" alt="Concrete Pump Image" />
  `
},
// -------------------- SPECIALIZED MACHINERY --------------------

// 1. Pile Driver
{
  question: "what is a pile driver?",
  keywords: "pile driver foundation machine",
  answer: `
    <strong>Pile driver</strong> is a machine used to drive piles into the soil
    to provide foundation support.
    <br><br>
    <strong>Working:</strong> Heavy hammer or hydraulic system pushes piles deep into the ground.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Support deep foundations</li>
      <li>Bypass weak soil layers</li>
      <li>Ensure stability of tall structures</li>
    </ul>
    <br><br>
    <img src="https://example.com/pile-driver.jpg" alt="Pile Driver Image" />
  `
},
{
  question: "पाइल ड्राइवर क्या है?",
  keywords: "पाइल ड्राइवर नींव मशीन",
  answer: `
    <strong>पाइल ड्राइवर</strong> एक मशीन है जो पाइल को मिट्टी में गाड़ने के लिए
    उपयोग होती है ताकि नींव को सहारा मिल सके।
    <br><br>
    <strong>कार्य:</strong> भारी हथौड़ा या हाइड्रोलिक सिस्टम पाइल को गहराई तक धकेलता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>गहरी नींव को सहारा देना</li>
      <li>कमज़ोर मिट्टी को पार करना</li>
      <li>ऊँची संरचनाओं की स्थिरता सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/pile-driver.jpg" alt="Pile Driver Image" />
  `
},

// 2. Grader
{
  question: "what is a grader?",
  keywords: "grader machine road leveling",
  answer: `
    <strong>Grader</strong> is a machine used to create a flat surface during
    road construction.
    <br><br>
    <strong>Working:</strong> A long blade levels soil or asphalt to desired grade.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Prepare base for roads</li>
      <li>Ensure smooth surface</li>
      <li>Improve drainage</li>
    </ul>
    <br><br>
    <img src="https://example.com/grader.jpg" alt="Grader Image" />
  `
},
{
  question: "ग्रेडर मशीन क्या है?",
  keywords: "ग्रेडर मशीन सड़क समतल",
  answer: `
    <strong>ग्रेडर</strong> एक मशीन है जो सड़क निर्माण में सतह को समतल करने के लिए उपयोग होती है।
    <br><br>
    <strong>कार्य:</strong> लंबा ब्लेड मिट्टी या डामर को समतल करता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>सड़क का बेस तैयार करना</li>
      <li>चिकनी सतह सुनिश्चित करना</li>
      <li>ड्रेनेज सुधारना</li>
    </ul>
    <br><br>
    <img src="https://example.com/grader.jpg" alt="Grader Image" />
  `
},

// 3. Asphalt Paver
{
  question: "what is an asphalt paver?",
  keywords: "asphalt paver road construction",
  answer: `
    <strong>Asphalt paver</strong> is a machine used to lay asphalt on roads,
    bridges, and parking lots.
    <br><br>
    <strong>Working:</strong> Hopper feeds asphalt mix, screed spreads and levels it.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Uniform asphalt layer</li>
      <li>Speed up road construction</li>
      <li>Ensure smooth finish</li>
    </ul>
    <br><br>
    <img src="https://example.com/asphalt-paver.jpg" alt="Asphalt Paver Image" />
  `
},
{
  question: "अस्फाल्ट पेवर क्या है?",
  keywords: "अस्फाल्ट पेवर सड़क निर्माण",
  answer: `
    <strong>अस्फाल्ट पेवर</strong> एक मशीन है जो सड़क, पुल और पार्किंग में डामर बिछाने के लिए उपयोग होती है।
    <br><br>
    <strong>कार्य:</strong> हॉपर डामर मिश्रण को फीड करता है और स्क्रीड उसे फैलाकर समतल करता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>समान डामर परत बनाना</li>
      <li>सड़क निर्माण तेज़ करना</li>
      <li>चिकनी फिनिश सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/asphalt-paver.jpg" alt="Asphalt Paver Image" />
  `
},

// 4. Backhoe Loader
{
  question: "what is a backhoe loader?",
  keywords: "backhoe loader multipurpose machine",
  answer: `
    <strong>Backhoe loader</strong> is a versatile machine combining a loader in front
    and an excavator at the back.
    <br><br>
    <strong>Working:</strong> Front bucket loads material, rear arm digs trenches.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Perform multiple tasks</li>
      <li>Excavation and loading in one machine</li>
      <li>Cost-effective for small projects</li>
    </ul>
    <br><br>
    <img src="https://example.com/backhoe-loader.jpg" alt="Backhoe Loader Image" />
  `
},
{
  question: "बैकहो लोडर क्या है?",
  keywords: "बैकहो लोडर बहुउद्देश्यीय मशीन",
  answer: `
    <strong>बैकहो लोडर</strong> एक बहुउद्देश्यीय मशीन है जिसमें आगे लोडर और पीछे खुदाई करने वाला आर्म होता है।
    <br><br>
    <strong>कार्य:</strong> सामने का बकेट सामग्री लोड करता है और पीछे का आर्म ट्रेंचिंग करता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>एक ही मशीन से कई काम करना</li>
      <li>खुदाई और लोडिंग दोनों</li>
      <li>छोटे प्रोजेक्ट्स के लिए किफायती</li>
    </ul>
    <br><br>
    <img src="https://example.com/backhoe-loader.jpg" alt="Backhoe Loader Image" />
  `
},
// -------------------- ROAD CONSTRUCTION --------------------
{
  question: "how does road construction work?",
  keywords: "road construction process layers",
  answer: `
    <strong>Road construction</strong> involves preparing the ground and laying
    different layers to form a durable road.
    <br><br>
    <strong>Working:</strong>
    <ul>
      <li>Clearing and grading the site</li>
      <li>Compacting soil with rollers</li>
      <li>Laying sub-base and base layers</li>
      <li>Applying asphalt or concrete surface</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Provide smooth transportation</li>
      <li>Improve connectivity</li>
      <li>Support economic growth</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-construction.jpg" alt="Road Construction Image" />
  `
},
{
  question: "सड़क निर्माण कैसे होता है?",
  keywords: "सड़क निर्माण प्रक्रिया परतें",
  answer: `
    <strong>सड़क निर्माण</strong> में ज़मीन तैयार करना और अलग-अलग परतें बिछाना शामिल है
    ताकि टिकाऊ सड़क बने।
    <br><br>
    <strong>कार्य:</strong>
    <ul>
      <li>साइट की सफाई और ग्रेडिंग</li>
      <li>मिट्टी को रोलर से दबाना</li>
      <li>सब-बेस और बेस परतें बिछाना</li>
      <li>ऊपर डामर या कंक्रीट सतह डालना</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>सुगम परिवहन देना</li>
      <li>कनेक्टिविटी बढ़ाना</li>
      <li>आर्थिक विकास को सहारा देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-construction.jpg" alt="Road Construction Image" />
  `
},

// -------------------- BRIDGE CONSTRUCTION --------------------
{
  question: "how does bridge construction work?",
  keywords: "bridge construction process types",
  answer: `
    <strong>Bridge construction</strong> involves designing and building structures
    to cross obstacles like rivers or valleys.
    <br><br>
    <strong>Working:</strong>
    <ul>
      <li>Survey and soil testing</li>
      <li>Foundation and piers construction</li>
      <li>Superstructure erection (beams, arches, cables)</li>
      <li>Deck slab and finishing</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Connect regions separated by obstacles</li>
      <li>Enable smooth transport</li>
      <li>Support trade and travel</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-construction.jpg" alt="Bridge Construction Image" />
  `
},
{
  question: "पुल निर्माण कैसे होता है?",
  keywords: "पुल निर्माण प्रक्रिया प्रकार",
  answer: `
    <strong>पुल निर्माण</strong> में नदियों या घाटियों जैसे अवरोधों को पार करने के लिए
    संरचना बनाना शामिल है।
    <br><br>
    <strong>कार्य:</strong>
    <ul>
      <li>सर्वे और मिट्टी की जाँच</li>
      <li>नींव और पियर्स का निर्माण</li>
      <li>सुपरस्ट्रक्चर (बीम, आर्च, केबल) लगाना</li>
      <li>डेक स्लैब और फिनिशिंग करना</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>अवरोधों से अलग क्षेत्रों को जोड़ना</li>
      <li>सुगम परिवहन देना</li>
      <li>व्यापार और यात्रा को सहारा देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-construction.jpg" alt="Bridge Construction Image" />
  `
},
// -------------------- TYPES OF ROADS --------------------
{
  question: "what are types of roads?",
  keywords: "types of roads highway expressway rural",
  answer: `
    <strong>Roads</strong> are classified based on usage and design.
    <br><br>
    <strong>Types:</strong>
    <ul>
      <li>Highways – connect major cities</li>
      <li>Expressways – high-speed, limited access</li>
      <li>Rural roads – connect villages</li>
      <li>Urban roads – within cities</li>
    </ul>
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Facilitate transport</li>
      <li>Support trade and travel</li>
      <li>Improve connectivity</li>
    </ul>
    <br><br>
    <img src="https://example.com/types-of-roads.jpg" alt="Types of Roads Image" />
  `
},
{
  question: "सड़कों के प्रकार कौन-कौन से हैं?",
  keywords: "सड़क प्रकार हाईवे एक्सप्रेसवे ग्रामीण",
  answer: `
    <strong>सड़कें</strong> उपयोग और डिज़ाइन के आधार पर वर्गीकृत होती हैं।
    <br><br>
    <strong>प्रकार:</strong>
    <ul>
      <li>हाईवे – बड़े शहरों को जोड़ते हैं</li>
      <li>एक्सप्रेसवे – तेज़ गति, सीमित प्रवेश</li>
      <li>ग्रामीण सड़कें – गाँवों को जोड़ती हैं</li>
      <li>शहरी सड़कें – शहरों के भीतर</li>
    </ul>
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>परिवहन को सुगम बनाना</li>
      <li>व्यापार और यात्रा को सहारा देना</li>
      <li>कनेक्टिविटी बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/types-of-roads.jpg" alt="Types of Roads Image" />
  `
},

// -------------------- TYPES OF BRIDGES --------------------
{
  question: "what are types of bridges?",
  keywords: "types of bridges beam arch suspension cable-stayed",
  answer: `
    <strong>Bridges</strong> are classified based on structure and design.
    <br><br>
    <strong>Types:</strong>
    <ul>
      <li>Beam bridge – simple horizontal beams</li>
      <li>Arch bridge – curved arch transfers load</li>
      <li>Suspension bridge – cables hold deck</li>
      <li>Cable-stayed bridge – cables directly connected to towers</li>
    </ul>
    <br><br>
    <strong>Purpose:</strong>
    <ul>
      <li>Cross rivers or valleys</li>
      <li>Enable smooth transport</li>
      <li>Support heavy loads</li>
    </ul>
    <br><br>
    <img src="https://example.com/types-of-bridges.jpg" alt="Types of Bridges Image" />
  `
},
{
  question: "पुलों के प्रकार कौन-कौन से हैं?",
  keywords: "पुल प्रकार बीम आर्च सस्पेंशन केबल-स्टे",
  answer: `
    <strong>पुल</strong> संरचना और डिज़ाइन के आधार पर वर्गीकृत होते हैं।
    <br><br>
    <strong>प्रकार:</strong>
    <ul>
      <li>बीम पुल – साधारण क्षैतिज बीम</li>
      <li>आर्च पुल – घुमावदार आर्च भार को स्थानांतरित करता है</li>
      <li>सस्पेंशन पुल – केबल्स डेक को पकड़ते हैं</li>
      <li>केबल-स्टे पुल – केबल सीधे टावर से जुड़े होते हैं</li>
    </ul>
    <br><br>
    <strong>उद्देश्य:</strong>
    <ul>
      <li>नदी या घाटी पार करना</li>
      <li>सुगम परिवहन देना</li>
      <li>भारी भार को सहारा देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/types-of-bridges.jpg" alt="Types of Bridges Image" />
  `
},
// -------------------- ROAD MATERIALS --------------------
{
  question: "what materials are used in road construction?",
  keywords: "road construction materials asphalt concrete aggregates",
  answer: `
    <strong>Road construction materials</strong> include:
    <ul>
      <li>Asphalt – flexible, smooth surface</li>
      <li>Concrete – durable, rigid pavement</li>
      <li>Aggregates – gravel, crushed stone for base layers</li>
      <li>Bitumen – binder for asphalt</li>
    </ul>
    <br><br>
    <strong>Advantages:</strong>
    <ul>
      <li>Asphalt – quick laying, smooth ride</li>
      <li>Concrete – long life, heavy load capacity</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-materials.jpg" alt="Road Materials Image" />
  `
},
{
  question: "सड़क निर्माण में कौन-कौन सी सामग्री उपयोग होती है?",
  keywords: "सड़क निर्माण सामग्री डामर कंक्रीट एग्रीगेट",
  answer: `
    <strong>सड़क निर्माण सामग्री</strong> में शामिल हैं:
    <ul>
      <li>डामर (Asphalt) – लचीली, चिकनी सतह</li>
      <li>कंक्रीट – टिकाऊ, कठोर पेवमेंट</li>
      <li>एग्रीगेट – बजरी, क्रश्ड स्टोन बेस परतों के लिए</li>
      <li>बिटुमेन – डामर को बाँधने वाला पदार्थ</li>
    </ul>
    <br><br>
    <strong>फायदे:</strong>
    <ul>
      <li>डामर – जल्दी बिछाना, चिकनी सवारी</li>
      <li>कंक्रीट – लंबी उम्र, भारी भार क्षमता</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-materials.jpg" alt="Road Materials Image" />
  `
},

// -------------------- BRIDGE MATERIALS --------------------
{
  question: "what materials are used in bridge construction?",
  keywords: "bridge construction materials steel concrete",
  answer: `
    <strong>Bridge construction materials</strong> include:
    <ul>
      <li>Steel – high tensile strength, used in cables and girders</li>
      <li>Concrete – compressive strength, used in piers and decks</li>
      <li>Composite materials – modern lightweight options</li>
      <li>Stone – traditional arch bridges</li>
    </ul>
    <br><br>
    <strong>Advantages:</strong>
    <ul>
      <li>Steel – flexible, strong under tension</li>
      <li>Concrete – durable, economical</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-materials.jpg" alt="Bridge Materials Image" />
  `
},
{
  question: "पुल निर्माण में कौन-कौन सी सामग्री उपयोग होती है?",
  keywords: "पुल निर्माण सामग्री स्टील कंक्रीट",
  answer: `
    <strong>पुल निर्माण सामग्री</strong> में शामिल हैं:
    <ul>
      <li>स्टील – उच्च तन्यता शक्ति, केबल और गर्डर में</li>
      <li>कंक्रीट – संपीड़न शक्ति, पियर्स और डेक में</li>
      <li>कंपोज़िट सामग्री – आधुनिक हल्के विकल्प</li>
      <li>पत्थर – पारंपरिक आर्च पुलों में</li>
    </ul>
    <br><br>
    <strong>फायदे:</strong>
    <ul>
      <li>स्टील – लचीला, तन्यता में मज़बूत</li>
      <li>कंक्रीट – टिकाऊ, किफायती</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-materials.jpg" alt="Bridge Materials Image" />
  `
},
// -------------------- ROAD CONSTRUCTION METHODS --------------------
{
  question: "what are road construction methods?",
  keywords: "road construction methods rigid flexible pavement",
  answer: `
    <strong>Road construction methods</strong> are mainly of two types:
    <br><br>
    <strong>Flexible pavement:</strong>
    <ul>
      <li>Made of asphalt layers</li>
      <li>Distributes load gradually</li>
      <li>Quick construction, lower cost</li>
    </ul>
    <strong>Rigid pavement:</strong>
    <ul>
      <li>Made of concrete slabs</li>
      <li>High strength, long life</li>
      <li>Suitable for heavy traffic</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-methods.jpg" alt="Road Construction Methods Image" />
  `
},
{
  question: "सड़क निर्माण की विधियाँ कौन-कौन सी हैं?",
  keywords: "सड़क निर्माण विधि कठोर लचीला पेवमेंट",
  answer: `
    <strong>सड़क निर्माण विधियाँ</strong> मुख्य रूप से दो प्रकार की होती हैं:
    <br><br>
    <strong>लचीला पेवमेंट:</strong>
    <ul>
      <li>डामर की परतों से बना</li>
      <li>भार धीरे-धीरे वितरित करता है</li>
      <li>तेज़ निर्माण, कम लागत</li>
    </ul>
    <strong>कठोर पेवमेंट:</strong>
    <ul>
      <li>कंक्रीट स्लैब से बना</li>
      <li>उच्च मज़बूती, लंबी उम्र</li>
      <li>भारी यातायात के लिए उपयुक्त</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-methods.jpg" alt="Road Construction Methods Image" />
  `
},

// -------------------- BRIDGE CONSTRUCTION METHODS --------------------
{
  question: "what are bridge construction methods?",
  keywords: "bridge construction methods cast-in-situ precast",
  answer: `
    <strong>Bridge construction methods</strong> include:
    <br><br>
    <strong>Cast-in-situ method:</strong>
    <ul>
      <li>Concrete poured directly at site</li>
      <li>Requires formwork and curing</li>
      <li>Flexible for custom designs</li>
    </ul>
    <strong>Precast method:</strong>
    <ul>
      <li>Components made off-site</li>
      <li>Transported and assembled on-site</li>
      <li>Faster construction, better quality control</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-methods.jpg" alt="Bridge Construction Methods Image" />
  `
},
{
  question: "पुल निर्माण की विधियाँ कौन-कौन सी हैं?",
  keywords: "पुल निर्माण विधि कास्ट-इन-सिटू प्रीकास्ट",
  answer: `
    <strong>पुल निर्माण विधियाँ</strong> में शामिल हैं:
    <br><br>
    <strong>कास्ट-इन-सिटू विधि:</strong>
    <ul>
      <li>कंक्रीट सीधे साइट पर डाला जाता है</li>
      <li>फॉर्मवर्क और क्योरिंग की ज़रूरत होती है</li>
      <li>कस्टम डिज़ाइन के लिए उपयुक्त</li>
    </ul>
    <strong>प्रीकास्ट विधि:</strong>
    <ul>
      <li>घटक साइट से बाहर बनाए जाते हैं</li>
      <li>साइट पर लाकर जोड़े जाते हैं</li>
      <li>तेज़ निर्माण, बेहतर गुणवत्ता नियंत्रण</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-methods.jpg" alt="Bridge Construction Methods Image" />
  `
},
// -------------------- ROAD MAINTENANCE --------------------
{
  question: "what are road maintenance practices?",
  keywords: "road maintenance resurfacing pothole repair",
  answer: `
    <strong>Road maintenance</strong> ensures roads remain safe and durable.
    <br><br>
    <strong>Practices:</strong>
    <ul>
      <li>Pothole filling – patch damaged areas</li>
      <li>Resurfacing – apply new asphalt layer</li>
      <li>Crack sealing – prevent water infiltration</li>
      <li>Drainage cleaning – avoid waterlogging</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Extend road life</li>
      <li>Ensure safety</li>
      <li>Reduce repair costs</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-maintenance.jpg" alt="Road Maintenance Image" />
  `
},
{
  question: "सड़क रखरखाव की विधियाँ कौन-कौन सी हैं?",
  keywords: "सड़क रखरखाव गड्ढा मरम्मत रिसर्फेसिंग",
  answer: `
    <strong>सड़क रखरखाव</strong> सड़कों को सुरक्षित और टिकाऊ बनाए रखने के लिए किया जाता है।
    <br><br>
    <strong>विधियाँ:</strong>
    <ul>
      <li>गड्ढा भरना – क्षतिग्रस्त हिस्सों को पैच करना</li>
      <li>रिसर्फेसिंग – नई डामर परत डालना</li>
      <li>क्रैक सीलिंग – पानी के रिसाव को रोकना</li>
      <li>ड्रेनेज सफाई – जलभराव रोकना</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>सड़क की उम्र बढ़ाना</li>
      <li>सुरक्षा सुनिश्चित करना</li>
      <li>मरम्मत लागत कम करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-maintenance.jpg" alt="Road Maintenance Image" />
  `
},

// -------------------- BRIDGE MAINTENANCE --------------------
{
  question: "what are bridge maintenance practices?",
  keywords: "bridge maintenance inspection repair",
  answer: `
    <strong>Bridge maintenance</strong> ensures structural safety and longevity.
    <br><br>
    <strong>Practices:</strong>
    <ul>
      <li>Regular inspection – check cracks, corrosion</li>
      <li>Cleaning and painting – protect steel parts</li>
      <li>Joint and bearing replacement – maintain flexibility</li>
      <li>Structural strengthening – add supports if needed</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Prevent accidents</li>
      <li>Extend bridge life</li>
      <li>Ensure safe transport</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-maintenance.jpg" alt="Bridge Maintenance Image" />
  `
},
{
  question: "पुल रखरखाव की विधियाँ कौन-कौन सी हैं?",
  keywords: "पुल रखरखाव निरीक्षण मरम्मत",
  answer: `
    <strong>पुल रखरखाव</strong> संरचना की सुरक्षा और लंबी उम्र सुनिश्चित करता है।
    <br><br>
    <strong>विधियाँ:</strong>
    <ul>
      <li>नियमित निरीक्षण – दरारें, जंग की जाँच</li>
      <li>सफाई और पेंटिंग – स्टील हिस्सों की सुरक्षा</li>
      <li>जॉइंट और बेयरिंग बदलना – लचीलापन बनाए रखना</li>
      <li>संरचनात्मक मज़बूती – ज़रूरत पड़ने पर सहारा जोड़ना</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>दुर्घटनाओं को रोकना</li>
      <li>पुल की उम्र बढ़ाना</li>
      <li>सुरक्षित परिवहन सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-maintenance.jpg" alt="Bridge Maintenance Image" />
  `
},
// -------------------- MODERN ROAD MAINTENANCE INNOVATIONS --------------------
{
  question: "what are modern innovations in road maintenance?",
  keywords: "road maintenance innovations smart sensors self-healing asphalt",
  answer: `
    <strong>Modern road maintenance innovations</strong> include:
    <ul>
      <li>Smart sensors – monitor traffic load and surface condition</li>
      <li>Drone inspections – quick aerial surveys for damage detection</li>
      <li>Self-healing asphalt – special binders repair cracks automatically</li>
      <li>Recycled materials – eco-friendly resurfacing</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Reduce maintenance costs</li>
      <li>Improve safety</li>
      <li>Promote sustainability</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-innovations.jpg" alt="Road Innovations Image" />
  `
},
{
  question: "सड़क रखरखाव में आधुनिक नवाचार कौन-कौन से हैं?",
  keywords: "सड़क रखरखाव नवाचार स्मार्ट सेंसर सेल्फ-हीलिंग डामर",
  answer: `
    <strong>सड़क रखरखाव में आधुनिक नवाचार</strong> शामिल हैं:
    <ul>
      <li>स्मार्ट सेंसर – यातायात भार और सतह की स्थिति की निगरानी</li>
      <li>ड्रोन निरीक्षण – क्षति का तेज़ हवाई सर्वेक्षण</li>
      <li>सेल्फ-हीलिंग डामर – विशेष बाइंडर दरारों को स्वतः ठीक करते हैं</li>
      <li>रीसाइकल सामग्री – पर्यावरण-अनुकूल रिसर्फेसिंग</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>रखरखाव लागत कम करना</li>
      <li>सुरक्षा बढ़ाना</li>
      <li>सस्टेनेबिलिटी को बढ़ावा देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-innovations.jpg" alt="Road Innovations Image" />
  `
},

// -------------------- MODERN BRIDGE MAINTENANCE INNOVATIONS --------------------
{
  question: "what are modern innovations in bridge maintenance?",
  keywords: "bridge maintenance innovations sensors corrosion-resistant steel",
  answer: `
    <strong>Modern bridge maintenance innovations</strong> include:
    <ul>
      <li>Structural health monitoring sensors – detect stress and cracks</li>
      <li>Drone and robotic inspections – access hard-to-reach areas</li>
      <li>Corrosion-resistant steel – extend lifespan of components</li>
      <li>Digital twins – simulate bridge performance for predictive maintenance</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Prevent failures</li>
      <li>Extend bridge life</li>
      <li>Enable proactive repairs</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-innovations.jpg" alt="Bridge Innovations Image" />
  `
},
{
  question: "पुल रखरखाव में आधुनिक नवाचार कौन-कौन से हैं?",
  keywords: "पुल रखरखाव नवाचार सेंसर जंग-रोधी स्टील",
  answer: `
    <strong>पुल रखरखाव में आधुनिक नवाचार</strong> शामिल हैं:
    <ul>
      <li>संरचनात्मक स्वास्थ्य निगरानी सेंसर – तनाव और दरारों का पता लगाना</li>
      <li>ड्रोन और रोबोट निरीक्षण – कठिन स्थानों तक पहुँचना</li>
      <li>जंग-रोधी स्टील – घटकों की उम्र बढ़ाना</li>
      <li>डिजिटल ट्विन – पुल के प्रदर्शन का सिमुलेशन कर भविष्यवाणी आधारित रखरखाव</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>विफलताओं को रोकना</li>
      <li>पुल की उम्र बढ़ाना</li>
      <li>प्रोएक्टिव मरम्मत सक्षम करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-innovations.jpg" alt="Bridge Innovations Image" />
  `
},
// -------------------- REAL-WORLD ROAD PROJECTS --------------------
{
  question: "what is the Delhi-Mumbai Expressway project?",
  keywords: "Delhi Mumbai Expressway road project India",
  answer: `
    <strong>Delhi-Mumbai Expressway</strong> is one of India's largest highway projects.
    <br><br>
    <strong>Working:</strong>
    <ul>
      <li>Length: ~1,386 km</li>
      <li>8-lane access-controlled expressway</li>
      <li>Built with advanced asphalt and concrete technology</li>
    </ul>
    <br><br>
    <strong>Why important:</strong>
    <ul>
      <li>Reduce travel time between Delhi and Mumbai</li>
      <li>Boost trade and logistics</li>
      <li>Improve connectivity across states</li>
    </ul>
    <br><br>
    <img src="https://example.com/delhi-mumbai-expressway.jpg" alt="Delhi-Mumbai Expressway Image" />
  `
},
{
  question: "दिल्ली-मुंबई एक्सप्रेसवे परियोजना क्या है?",
  keywords: "दिल्ली मुंबई एक्सप्रेसवे सड़क परियोजना भारत",
  answer: `
    <strong>दिल्ली-मुंबई एक्सप्रेसवे</strong> भारत की सबसे बड़ी हाईवे परियोजनाओं में से एक है।
    <br><br>
    <strong>कार्य:</strong>
    <ul>
      <li>लंबाई: ~1,386 किमी</li>
      <li>8-लेन एक्सेस-कंट्रोल्ड एक्सप्रेसवे</li>
      <li>उन्नत डामर और कंक्रीट तकनीक से निर्मित</li>
    </ul>
    <br><br>
    <strong>महत्व:</strong>
    <ul>
      <li>दिल्ली और मुंबई के बीच यात्रा समय कम करना</li>
      <li>व्यापार और लॉजिस्टिक्स को बढ़ावा देना</li>
      <li>राज्यों के बीच कनेक्टिविटी सुधारना</li>
    </ul>
    <br><br>
    <img src="https://example.com/delhi-mumbai-expressway.jpg" alt="Delhi-Mumbai Expressway Image" />
  `
},

// -------------------- REAL-WORLD BRIDGE PROJECTS --------------------
{
  question: "what is the Bandra-Worli Sea Link?",
  keywords: "Bandra Worli Sea Link bridge Mumbai",
  answer: `
    <strong>Bandra-Worli Sea Link</strong> is a cable-stayed bridge in Mumbai, India.
    <br><br>
    <strong>Working:</strong>
    <ul>
      <li>Length: ~5.6 km</li>
      <li>Cable-stayed design with pre-stressed concrete</li>
      <li>Connects Bandra and Worli across the Arabian Sea</li>
    </ul>
    <br><br>
    <strong>Why important:</strong>
    <ul>
      <li>Reduce travel time in Mumbai</li>
      <li>Iconic engineering landmark</li>
      <li>Boost urban connectivity</li>
    </ul>
    <br><br>
    <img src="https://example.com/bandra-worli-sea-link.jpg" alt="Bandra-Worli Sea Link Image" />
  `
},
{
  question: "बांद्रा-वर्ली सी लिंक क्या है?",
  keywords: "बांद्रा वर्ली सी लिंक पुल मुंबई",
  answer: `
    <strong>बांद्रा-वर्ली सी लिंक</strong> मुंबई, भारत में एक केबल-स्टे पुल है।
    <br><br>
    <strong>कार्य:</strong>
    <ul>
      <li>लंबाई: ~5.6 किमी</li>
      <li>केबल-स्टे डिज़ाइन और प्री-स्ट्रेस्ड कंक्रीट</li>
      <li>अरब सागर पर बांद्रा और वर्ली को जोड़ता है</li>
    </ul>
    <br><br>
    <strong>महत्व:</strong>
    <ul>
      <li>मुंबई में यात्रा समय कम करना</li>
      <li>प्रसिद्ध इंजीनियरिंग लैंडमार्क</li>
      <li>शहरी कनेक्टिविटी बढ़ाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/bandra-worli-sea-link.jpg" alt="Bandra-Worli Sea Link Image" />
  `
},
// -------------------- FUTURE ROAD CONSTRUCTION TRENDS --------------------
{
  question: "what are future trends in road construction?",
  keywords: "future road construction smart highways eco-friendly materials",
  answer: `
    <strong>Future road construction trends</strong> include:
    <ul>
      <li>Smart highways – embedded sensors for traffic and safety monitoring</li>
      <li>Solar roads – generate renewable energy from road surfaces</li>
      <li>Eco-friendly materials – recycled plastic, self-healing asphalt</li>
      <li>AI-based traffic management – optimize flow and reduce congestion</li>
    </ul>
    <br><br>
    <strong>Why important:</strong>
    <ul>
      <li>Improve sustainability</li>
      <li>Enhance safety</li>
      <li>Support smart cities</li>
    </ul>
    <br><br>
    <img src="https://example.com/future-road.jpg" alt="Future Road Construction Image" />
  `
},
{
  question: "सड़क निर्माण में भविष्य की प्रवृत्तियाँ क्या हैं?",
  keywords: "भविष्य सड़क निर्माण स्मार्ट हाईवे पर्यावरण-अनुकूल सामग्री",
  answer: `
    <strong>सड़क निर्माण में भविष्य की प्रवृत्तियाँ</strong> शामिल हैं:
    <ul>
      <li>स्मार्ट हाईवे – सेंसर लगे होंगे जो यातायात और सुरक्षा की निगरानी करेंगे</li>
      <li>सोलर रोड – सड़क सतह से नवीकरणीय ऊर्जा उत्पन्न करना</li>
      <li>पर्यावरण-अनुकूल सामग्री – रीसाइकल प्लास्टिक, सेल्फ-हीलिंग डामर</li>
      <li>एआई आधारित ट्रैफिक मैनेजमेंट – यातायात प्रवाह को अनुकूलित करना</li>
    </ul>
    <br><br>
    <strong>महत्व:</strong>
    <ul>
      <li>सस्टेनेबिलिटी बढ़ाना</li>
      <li>सुरक्षा सुधारना</li>
      <li>स्मार्ट सिटी को समर्थन देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/future-road.jpg" alt="Future Road Construction Image" />
  `
},

// -------------------- FUTURE BRIDGE CONSTRUCTION TRENDS --------------------
{
  question: "what are future trends in bridge construction?",
  keywords: "future bridge construction floating bridges smart monitoring",
  answer: `
    <strong>Future bridge construction trends</strong> include:
    <ul>
      <li>Floating bridges – built on pontoons for water crossings</li>
      <li>Smart monitoring systems – sensors track stress and vibrations</li>
      <li>Modular bridges – prefabricated units for quick assembly</li>
      <li>Eco-friendly designs – corrosion-resistant steel, sustainable concrete</li>
    </ul>
    <br><br>
    <strong>Why important:</strong>
    <ul>
      <li>Adapt to challenging environments</li>
      <li>Ensure long-term safety</li>
      <li>Reduce construction time</li>
    </ul>
    <br><br>
    <img src="https://example.com/future-bridge.jpg" alt="Future Bridge Construction Image" />
  `
},
{
  question: "पुल निर्माण में भविष्य की प्रवृत्तियाँ क्या हैं?",
  keywords: "भविष्य पुल निर्माण फ्लोटिंग ब्रिज स्मार्ट मॉनिटरिंग",
  answer: `
    <strong>पुल निर्माण में भविष्य की प्रवृत्तियाँ</strong> शामिल हैं:
    <ul>
      <li>फ्लोटिंग ब्रिज – पानी पर पोंटून पर बनाए जाते हैं</li>
      <li>स्मार्ट मॉनिटरिंग सिस्टम – सेंसर तनाव और कंपन को ट्रैक करते हैं</li>
      <li>मॉड्यूलर ब्रिज – प्रीफैब्रिकेटेड यूनिट्स से जल्दी असेंबली</li>
      <li>पर्यावरण-अनुकूल डिज़ाइन – जंग-रोधी स्टील, टिकाऊ कंक्रीट</li>
    </ul>
    <br><br>
    <strong>महत्व:</strong>
    <ul>
      <li>कठिन वातावरण में अनुकूल होना</li>
      <li>लंबी अवधि की सुरक्षा सुनिश्चित करना</li>
      <li>निर्माण समय कम करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/future-bridge.jpg" alt="Future Bridge Construction Image" />
  `
},
// -------------------- SMART CITY INTEGRATION: ROADS --------------------
{
  question: "how are roads integrated with smart cities?",
  keywords: "smart city roads IoT EV charging AI traffic",
  answer: `
    <strong>Smart city roads</strong> use advanced technologies to improve transport efficiency.
    <br><br>
    <strong>Integration:</strong>
    <ul>
      <li>IoT sensors – monitor traffic, pollution, and road conditions</li>
      <li>EV charging roads – embedded charging coils for electric vehicles</li>
      <li>AI traffic lights – adaptive signals reduce congestion</li>
      <li>Smart signage – digital boards provide real-time updates</li>
    </ul>
    <br><br>
    <strong>Why important:</strong>
    <ul>
      <li>Enhance mobility</li>
      <li>Support sustainable transport</li>
      <li>Improve safety and efficiency</li>
    </ul>
    <br><br>
    <img src="https://example.com/smart-city-roads.jpg" alt="Smart City Roads Image" />
  `
},
{
  question: "स्मार्ट सिटी में सड़कें कैसे एकीकृत होती हैं?",
  keywords: "स्मार्ट सिटी सड़कें IoT EV चार्जिंग एआई ट्रैफिक",
  answer: `
    <strong>स्मार्ट सिटी सड़कें</strong> उन्नत तकनीकों का उपयोग करती हैं ताकि परिवहन अधिक कुशल हो सके।
    <br><br>
    <strong>एकीकरण:</strong>
    <ul>
      <li>IoT सेंसर – यातायात, प्रदूषण और सड़क की स्थिति की निगरानी</li>
      <li>EV चार्जिंग सड़कें – इलेक्ट्रिक वाहनों के लिए चार्जिंग कॉइल</li>
      <li>एआई ट्रैफिक लाइट – अनुकूलित सिग्नल भीड़ कम करते हैं</li>
      <li>स्मार्ट साइनबोर्ड – रियल-टाइम अपडेट प्रदान करते हैं</li>
    </ul>
    <br><br>
    <strong>महत्व:</strong>
    <ul>
      <li>गतिशीलता बढ़ाना</li>
      <li>सतत परिवहन को समर्थन देना</li>
      <li>सुरक्षा और दक्षता सुधारना</li>
    </ul>
    <br><br>
    <img src="https://example.com/smart-city-roads.jpg" alt="Smart City Roads Image" />
  `
},

// -------------------- SMART CITY INTEGRATION: BRIDGES --------------------
{
  question: "how are bridges integrated with smart cities?",
  keywords: "smart city bridges digital twin sensors AI monitoring",
  answer: `
    <strong>Smart city bridges</strong> use digital and sensor technologies for safety and efficiency.
    <br><br>
    <strong>Integration:</strong>
    <ul>
      <li>Digital twins – simulate bridge performance for predictive maintenance</li>
      <li>AI monitoring – detect stress, vibration, and cracks</li>
      <li>Smart lighting – energy-efficient LED systems</li>
      <li>IoT connectivity – real-time data for city planners</li>
    </ul>
    <br><br>
    <strong>Why important:</strong>
    <ul>
      <li>Prevent failures</li>
      <li>Improve urban safety</li>
      <li>Enable proactive maintenance</li>
    </ul>
    <br><br>
    <img src="https://example.com/smart-city-bridges.jpg" alt="Smart City Bridges Image" />
  `
},
{
  question: "स्मार्ट सिटी में पुल कैसे एकीकृत होते हैं?",
  keywords: "स्मार्ट सिटी पुल डिजिटल ट्विन सेंसर एआई मॉनिटरिंग",
  answer: `
    <strong>स्मार्ट सिटी पुल</strong> सुरक्षा और दक्षता के लिए डिजिटल और सेंसर तकनीक का उपयोग करते हैं।
    <br><br>
    <strong>एकीकरण:</strong>
    <ul>
      <li>डिजिटल ट्विन – पुल के प्रदर्शन का सिमुलेशन कर भविष्यवाणी आधारित रखरखाव</li>
      <li>एआई मॉनिटरिंग – तनाव, कंपन और दरारों का पता लगाना</li>
      <li>स्मार्ट लाइटिंग – ऊर्जा-कुशल LED सिस्टम</li>
      <li>IoT कनेक्टिविटी – शहर योजनाकारों के लिए रियल-टाइम डेटा</li>
    </ul>
    <br><br>
    <strong>महत्व:</strong>
    <ul>
      <li>विफलताओं को रोकना</li>
      <li>शहरी सुरक्षा सुधारना</li>
      <li>प्रोएक्टिव रखरखाव सक्षम करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/smart-city-bridges.jpg" alt="Smart City Bridges Image" />
  `
},
// -------------------- ENVIRONMENTAL IMPACT: ROADS --------------------
{
  question: "what are environmental impacts of road construction?",
  keywords: "road construction environmental impact sustainability",
  answer: `
    <strong>Environmental impacts of road construction</strong> include:
    <ul>
      <li>Deforestation and habitat loss</li>
      <li>Air pollution from machinery</li>
      <li>Noise pollution affecting communities</li>
      <li>Water runoff and soil erosion</li>
    </ul>
    <br><br>
    <strong>Sustainability practices:</strong>
    <ul>
      <li>Use recycled asphalt and plastic</li>
      <li>Install noise barriers</li>
      <li>Rainwater harvesting along highways</li>
      <li>Green pavements with permeable surfaces</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-sustainability.jpg" alt="Road Sustainability Image" />
  `
},
{
  question: "सड़क निर्माण के पर्यावरणीय प्रभाव क्या हैं?",
  keywords: "सड़क निर्माण पर्यावरण प्रभाव सस्टेनेबिलिटी",
  answer: `
    <strong>सड़क निर्माण के पर्यावरणीय प्रभाव</strong> में शामिल हैं:
    <ul>
      <li>वनों की कटाई और आवास का नुकसान</li>
      <li>मशीनरी से वायु प्रदूषण</li>
      <li>शोर प्रदूषण जो समुदायों को प्रभावित करता है</li>
      <li>जल बहाव और मिट्टी का कटाव</li>
    </ul>
    <br><br>
    <strong>सस्टेनेबिलिटी उपाय:</strong>
    <ul>
      <li>रीसाइकल डामर और प्लास्टिक का उपयोग</li>
      <li>शोर अवरोधक लगाना</li>
      <li>हाईवे पर वर्षा जल संचयन</li>
      <li>ग्रीन पेवमेंट (पारगम्य सतह)</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-sustainability.jpg" alt="Road Sustainability Image" />
  `
},

// -------------------- ENVIRONMENTAL IMPACT: BRIDGES --------------------
{
  question: "what are environmental impacts of bridge construction?",
  keywords: "bridge construction environmental impact sustainability",
  answer: `
    <strong>Environmental impacts of bridge construction</strong> include:
    <ul>
      <li>Disturbance to river ecosystems</li>
      <li>Noise and vibration affecting wildlife</li>
      <li>Carbon emissions from concrete and steel</li>
      <li>Visual impact on landscapes</li>
    </ul>
    <br><br>
    <strong>Sustainability practices:</strong>
    <ul>
      <li>Use corrosion-resistant and recycled steel</li>
      <li>Eco-friendly concrete with fly ash</li>
      <li>Design bridges with minimal ecological footprint</li>
      <li>Install rainwater drainage systems</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-sustainability.jpg" alt="Bridge Sustainability Image" />
  `
},
{
  question: "पुल निर्माण के पर्यावरणीय प्रभाव क्या हैं?",
  keywords: "पुल निर्माण पर्यावरण प्रभाव सस्टेनेबिलिटी",
  answer: `
    <strong>पुल निर्माण के पर्यावरणीय प्रभाव</strong> में शामिल हैं:
    <ul>
      <li>नदी पारिस्थितिकी तंत्र में व्यवधान</li>
      <li>वन्यजीवों पर शोर और कंपन का असर</li>
      <li>कंक्रीट और स्टील से कार्बन उत्सर्जन</li>
      <li>प्राकृतिक दृश्य पर प्रभाव</li>
    </ul>
    <br><br>
    <strong>सस्टेनेबिलिटी उपाय:</strong>
    <ul>
      <li>जंग-रोधी और रीसाइकल स्टील का उपयोग</li>
      <li>फ्लाई ऐश युक्त पर्यावरण-अनुकूल कंक्रीट</li>
      <li>न्यूनतम पारिस्थितिक प्रभाव वाले डिज़ाइन</li>
      <li>वर्षा जल निकासी प्रणाली लगाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-sustainability.jpg" alt="Bridge Sustainability Image" />
  `
},
// -------------------- ECONOMIC ASPECTS: ROADS --------------------
{
  question: "what are economic aspects of road construction?",
  keywords: "road construction cost estimation funding PPP",
  answer: `
    <strong>Economic aspects of road construction</strong> include:
    <ul>
      <li>Cost estimation – materials, labor, machinery, land acquisition</li>
      <li>Funding models – government budget, loans, PPP (Public-Private Partnership)</li>
      <li>Economic benefits – reduced travel time, improved trade, job creation</li>
      <li>Long-term savings – durable roads reduce maintenance costs</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-economics.jpg" alt="Road Economics Image" />
  `
},
{
  question: "सड़क निर्माण के आर्थिक पहलू क्या हैं?",
  keywords: "सड़क निर्माण लागत अनुमान फंडिंग पीपीपी",
  answer: `
    <strong>सड़क निर्माण के आर्थिक पहलू</strong> में शामिल हैं:
    <ul>
      <li>लागत अनुमान – सामग्री, मज़दूरी, मशीनरी, भूमि अधिग्रहण</li>
      <li>फंडिंग मॉडल – सरकारी बजट, ऋण, पीपीपी (पब्लिक-प्राइवेट पार्टनरशिप)</li>
      <li>आर्थिक लाभ – यात्रा समय कम होना, व्यापार सुधार, रोजगार सृजन</li>
      <li>दीर्घकालिक बचत – टिकाऊ सड़कें रखरखाव लागत कम करती हैं</li>
    </ul>
    <br><br>
    <img src="https://example.com/road-economics.jpg" alt="Road Economics Image" />
  `
},

// -------------------- ECONOMIC ASPECTS: BRIDGES --------------------
{
  question: "what are economic aspects of bridge construction?",
  keywords: "bridge construction cost funding PPP benefits",
  answer: `
    <strong>Economic aspects of bridge construction</strong> include:
    <ul>
      <li>High initial investment – materials like steel and concrete</li>
      <li>Funding – government projects, international loans, PPP models</li>
      <li>Economic benefits – connect regions, boost trade, tourism</li>
      <li>Long-term returns – durable bridges reduce transport costs</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-economics.jpg" alt="Bridge Economics Image" />
  `
},
{
  question: "पुल निर्माण के आर्थिक पहलू क्या हैं?",
  keywords: "पुल निर्माण लागत फंडिंग पीपीपी लाभ",
  answer: `
    <strong>पुल निर्माण के आर्थिक पहलू</strong> में शामिल हैं:
    <ul>
      <li>उच्च प्रारंभिक निवेश – स्टील और कंक्रीट जैसी सामग्री</li>
      <li>फंडिंग – सरकारी परियोजनाएँ, अंतरराष्ट्रीय ऋण, पीपीपी मॉडल</li>
      <li>आर्थिक लाभ – क्षेत्रों को जोड़ना, व्यापार और पर्यटन को बढ़ावा देना</li>
      <li>दीर्घकालिक लाभ – टिकाऊ पुल परिवहन लागत कम करते हैं</li>
    </ul>
    <br><br>
    <img src="https://example.com/bridge-economics.jpg" alt="Bridge Economics Image" />
  `
},
// -------------------- SOCIAL IMPACT: ROADS --------------------
{
  question: "what are social impacts of road construction?",
  keywords: "road construction social impact connectivity rural development",
  answer: `
    <strong>Social impacts of road construction</strong> include:
    <ul>
      <li>Improved connectivity between cities and villages</li>
      <li>Access to education, healthcare, and markets</li>
      <li>Boost rural development and reduce isolation</li>
      <li>Increase employment opportunities</li>
    </ul>
    <br><br>
    <strong>Challenges:</strong>
    <ul>
      <li>Displacement of communities</li>
      <li>Noise and pollution affecting locals</li>
    </ul>
    <br><br>
    <img src="https://example.com/social-impact-roads.jpg" alt="Social Impact Roads Image" />
  `
},
{
  question: "सड़क निर्माण के सामाजिक प्रभाव क्या हैं?",
  keywords: "सड़क निर्माण सामाजिक प्रभाव कनेक्टिविटी ग्रामीण विकास",
  answer: `
    <strong>सड़क निर्माण के सामाजिक प्रभाव</strong> में शामिल हैं:
    <ul>
      <li>शहरों और गाँवों के बीच कनेक्टिविटी सुधारना</li>
      <li>शिक्षा, स्वास्थ्य और बाज़ार तक पहुँच</li>
      <li>ग्रामीण विकास को बढ़ावा देना और अलगाव कम करना</li>
      <li>रोज़गार के अवसर बढ़ाना</li>
    </ul>
    <br><br>
    <strong>चुनौतियाँ:</strong>
    <ul>
      <li>समुदायों का विस्थापन</li>
      <li>स्थानीय लोगों पर शोर और प्रदूषण का असर</li>
    </ul>
    <br><br>
    <img src="https://example.com/social-impact-roads.jpg" alt="Social Impact Roads Image" />
  `
},

// -------------------- SOCIAL IMPACT: BRIDGES --------------------
{
  question: "what are social impacts of bridge construction?",
  keywords: "bridge construction social impact connectivity urban growth",
  answer: `
    <strong>Social impacts of bridge construction</strong> include:
    <ul>
      <li>Connect regions separated by rivers or valleys</li>
      <li>Enable faster travel and reduce isolation</li>
      <li>Support urban growth and tourism</li>
      <li>Strengthen national integration</li>
    </ul>
    <br><br>
    <strong>Challenges:</strong>
    <ul>
      <li>Displacement during construction</li>
      <li>Impact on local ecosystems</li>
    </ul>
    <br><br>
    <img src="https://example.com/social-impact-bridges.jpg" alt="Social Impact Bridges Image" />
  `
},
{
  question: "पुल निर्माण के सामाजिक प्रभाव क्या हैं?",
  keywords: "पुल निर्माण सामाजिक प्रभाव कनेक्टिविटी शहरी विकास",
  answer: `
    <strong>पुल निर्माण के सामाजिक प्रभाव</strong> में शामिल हैं:
    <ul>
      <li>नदियों या घाटियों से अलग क्षेत्रों को जोड़ना</li>
      <li>तेज़ यात्रा और अलगाव कम करना</li>
      <li>शहरी विकास और पर्यटन को समर्थन देना</li>
      <li>राष्ट्रीय एकता को मज़बूत करना</li>
    </ul>
    <br><br>
    <strong>चुनौतियाँ:</strong>
    <ul>
      <li>निर्माण के दौरान विस्थापन</li>
      <li>स्थानीय पारिस्थितिकी तंत्र पर असर</li>
    </ul>
    <br><br>
    <img src="https://example.com/social-impact-bridges.jpg" alt="Social Impact Bridges Image" />
  `
},
// -------------------- ROUGH CARPENTER --------------------
{
  question: "what is a rough carpenter?",
  keywords: "rough carpenter framing structural",
  answer: `
    <strong>Rough carpenter</strong> works on structural framing, scaffolding, and large wooden frameworks.
    <br><br>
    <strong>Working:</strong> Focuses on strength and durability, not fine finish.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Build house frames</li>
      <li>Support roofs and scaffolds</li>
      <li>Provide structural stability</li>
    </ul>
    <br><br>
    <img src="https://example.com/rough-carpenter.jpg" alt="Rough Carpenter Image" />
  `
},
{
  question: "रफ़ कारपेंटर कौन होता है?",
  keywords: "रफ़ कारपेंटर फ्रेमिंग संरचना",
  answer: `
    <strong>रफ़ कारपेंटर</strong> बड़े लकड़ी के फ्रेम, स्कैफ़ोल्डिंग और संरचनात्मक काम करता है।
    <br><br>
    <strong>कार्य:</strong> मज़बूती और टिकाऊपन पर ध्यान, फिनिश पर नहीं।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>घर का फ्रेम बनाना</li>
      <li>छत और स्कैफ़ोल्ड को सहारा देना</li>
      <li>संरचना को स्थिरता देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/rough-carpenter.jpg" alt="Rough Carpenter Image" />
  `
},

// -------------------- FINISH/TRIM CARPENTER --------------------
{
  question: "what is a finish carpenter?",
  keywords: "finish carpenter trim fine detail",
  answer: `
    <strong>Finish carpenter</strong> specializes in fine details like doors, windows, moldings, and cabinetry.
    <br><br>
    <strong>Working:</strong> Precision cutting, fitting, and polishing.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Improve aesthetics</li>
      <li>Provide smooth finishes</li>
      <li>Enhance interior design</li>
    </ul>
    <br><br>
    <img src="https://example.com/finish-carpenter.jpg" alt="Finish Carpenter Image" />
  `
},
{
  question: "फिनिश कारपेंटर कौन होता है?",
  keywords: "फिनिश कारपेंटर ट्रिम बारीक काम",
  answer: `
    <strong>फिनिश कारपेंटर</strong> दरवाज़े, खिड़कियाँ, मोल्डिंग और कैबिनेट जैसे बारीक काम में विशेषज्ञ होता है।
    <br><br>
    <strong>कार्य:</strong> सटीक कटाई, फिटिंग और पॉलिशिंग।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>सौंदर्य बढ़ाना</li>
      <li>चिकनी फिनिश देना</li>
      <li>इंटीरियर डिज़ाइन को बेहतर बनाना</li>
    </ul>
    <br><br>
    <img src="https://example.com/finish-carpenter.jpg" alt="Finish Carpenter Image" />
  `
},

// -------------------- CABINET MAKER --------------------
{
  question: "what is a cabinet maker?",
  keywords: "cabinet maker furniture joinery",
  answer: `
    <strong>Cabinet maker</strong> focuses on furniture, cabinets, and detailed joinery.
    <br><br>
    <strong>Working:</strong> Uses fine tools for precision joints and decorative finishes.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Create custom furniture</li>
      <li>Provide storage solutions</li>
      <li>Add decorative value</li>
    </ul>
    <br><br>
    <img src="https://example.com/cabinet-maker.jpg" alt="Cabinet Maker Image" />
  `
},
{
  question: "कैबिनेट मेकर कौन होता है?",
  keywords: "कैबिनेट मेकर फर्नीचर जॉइनरी",
  answer: `
    <strong>कैबिनेट मेकर</strong> फर्नीचर, कैबिनेट और बारीक जॉइनरी पर काम करता है।
    <br><br>
    <strong>कार्य:</strong> सटीक जोड़ और सजावटी फिनिश के लिए बारीक औज़ारों का उपयोग।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>कस्टम फर्नीचर बनाना</li>
      <li>स्टोरेज समाधान देना</li>
      <li>सजावटी मूल्य जोड़ना</li>
    </ul>
    <br><br>
    <img src="https://example.com/cabinet-maker.jpg" alt="Cabinet Maker Image" />
  `
},
// -------------------- SHIP CARPENTER --------------------
{
  question: "what is a ship carpenter?",
  keywords: "ship carpenter boat building marine",
  answer: `
    <strong>Ship carpenter</strong> specializes in building and repairing boats and ships.
    <br><br>
    <strong>Working:</strong> Uses waterproof timber, joints, and marine-grade finishes.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Construct wooden boats</li>
      <li>Repair marine structures</li>
      <li>Ensure seaworthiness</li>
    </ul>
    <br><br>
    <img src="https://example.com/ship-carpenter.jpg" alt="Ship Carpenter Image" />
  `
},
{
  question: "शिप कारपेंटर कौन होता है?",
  keywords: "शिप कारपेंटर नाव निर्माण समुद्री",
  answer: `
    <strong>शिप कारपेंटर</strong> नाव और जहाज़ बनाने व मरम्मत करने में विशेषज्ञ होता है।
    <br><br>
    <strong>कार्य:</strong> वाटरप्रूफ लकड़ी, जोड़ और मरीन-ग्रेड फिनिश का उपयोग करता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>लकड़ी की नावें बनाना</li>
      <li>समुद्री संरचनाओं की मरम्मत करना</li>
      <li>समुद्री सुरक्षा सुनिश्चित करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/ship-carpenter.jpg" alt="Ship Carpenter Image" />
  `
},

// -------------------- SCENIC CARPENTER --------------------
{
  question: "what is a scenic carpenter?",
  keywords: "scenic carpenter stage set theatre",
  answer: `
    <strong>Scenic carpenter</strong> builds stage sets and props for theatre, film, and TV.
    <br><br>
    <strong>Working:</strong> Uses lightweight wood, modular frames, and decorative finishes.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Create stage scenery</li>
      <li>Support film and theatre productions</li>
      <li>Provide safe, reusable sets</li>
    </ul>
    <br><br>
    <img src="https://example.com/scenic-carpenter.jpg" alt="Scenic Carpenter Image" />
  `
},
{
  question: "सीनिक कारपेंटर कौन होता है?",
  keywords: "सीनिक कारपेंटर स्टेज सेट थिएटर",
  answer: `
    <strong>सीनिक कारपेंटर</strong> थिएटर, फिल्म और टीवी के लिए स्टेज सेट और प्रॉप्स बनाता है।
    <br><br>
    <strong>कार्य:</strong> हल्की लकड़ी, मॉड्यूलर फ्रेम और सजावटी फिनिश का उपयोग करता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>स्टेज सीनरी तैयार करना</li>
      <li>फिल्म और थिएटर प्रोडक्शन को सहारा देना</li>
      <li>सुरक्षित और पुन: उपयोग योग्य सेट प्रदान करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/scenic-carpenter.jpg" alt="Scenic Carpenter Image" />
  `
},

// -------------------- GREEN CARPENTER --------------------
{
  question: "what is a green carpenter?",
  keywords: "green carpenter eco-friendly sustainable",
  answer: `
    <strong>Green carpenter</strong> focuses on eco-friendly and sustainable woodworking.
    <br><br>
    <strong>Working:</strong> Uses recycled wood, non-toxic finishes, and energy-efficient methods.
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Reduce environmental impact</li>
      <li>Promote sustainable construction</li>
      <li>Support green building practices</li>
    </ul>
    <br><br>
    <img src="https://example.com/green-carpenter.jpg" alt="Green Carpenter Image" />
  `
},
{
  question: "ग्रीन कारपेंटर कौन होता है?",
  keywords: "ग्रीन कारपेंटर पर्यावरण-अनुकूल टिकाऊ",
  answer: `
    <strong>ग्रीन कारपेंटर</strong> पर्यावरण-अनुकूल और टिकाऊ वुडवर्किंग पर ध्यान देता है।
    <br><br>
    <strong>कार्य:</strong> रीसाइकल लकड़ी, गैर-विषाक्त फिनिश और ऊर्जा-कुशल तरीकों का उपयोग करता है।
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>पर्यावरणीय प्रभाव कम करना</li>
      <li>सस्टेनेबल निर्माण को बढ़ावा देना</li>
      <li>ग्रीन बिल्डिंग प्रैक्टिस को समर्थन देना</li>
    </ul>
    <br><br>
    <img src="https://example.com/green-carpenter.jpg" alt="Green Carpenter Image" />
  `
},
// -------------------- HAND TOOLS --------------------
{
  question: "what are common hand tools used by carpenters?",
  keywords: "carpenter hand tools saw chisel hammer",
  answer: `
    <strong>Common hand tools</strong> used by carpenters include:
    <ul>
      <li>Hand saw – cutting wood</li>
      <li>Chisel – shaping and carving</li>
      <li>Hammer – driving nails</li>
      <li>Plane – smoothing surfaces</li>
      <li>Measuring tape – accurate dimensions</li>
    </ul>
    <br><br>
    <strong>Techniques:</strong> Manual cutting, chiseling, planing, and precise measuring.
    <br><br>
    <img src="https://example.com/carpenter-hand-tools.jpg" alt="Carpenter Hand Tools Image" />
  `
},
{
  question: "कारपेंटर द्वारा उपयोग किए जाने वाले सामान्य हाथ औज़ार कौन-कौन से हैं?",
  keywords: "कारपेंटर हाथ औज़ार आरी छैनी हथौड़ा",
  answer: `
    <strong>सामान्य हाथ औज़ार</strong> जो कारपेंटर उपयोग करते हैं:
    <ul>
      <li>हैंड आरी – लकड़ी काटने के लिए</li>
      <li>छैनी – आकार देने और नक्काशी के लिए</li>
      <li>हथौड़ा – कील ठोकने के लिए</li>
      <li>प्लेन – सतह को चिकना करने के लिए</li>
      <li>मापने का फीता – सटीक माप के लिए</li>
    </ul>
    <br><br>
    <strong>तकनीक:</strong> मैनुअल कटिंग, छैनी से आकार देना, प्लेनिंग और सटीक माप लेना।
    <br><br>
    <img src="https://example.com/carpenter-hand-tools.jpg" alt="Carpenter Hand Tools Image" />
  `
},

// -------------------- POWER TOOLS --------------------
{
  question: "what are common power tools used by carpenters?",
  keywords: "carpenter power tools drill saw sander",
  answer: `
    <strong>Common power tools</strong> used by carpenters include:
    <ul>
      <li>Electric drill – boring holes</li>
      <li>Circular saw – fast cutting</li>
      <li>Jigsaw – curved cutting</li>
      <li>Sander – smooth finishing</li>
      <li>Nail gun – quick fastening</li>
    </ul>
    <br><br>
    <strong>Techniques:</strong> Power cutting, drilling, sanding, and fastening.
    <br><br>
    <img src="https://example.com/carpenter-power-tools.jpg" alt="Carpenter Power Tools Image" />
  `
},
{
  question: "कारपेंटर द्वारा उपयोग किए जाने वाले सामान्य पावर टूल्स कौन-कौन से हैं?",
  keywords: "कारपेंटर पावर टूल्स ड्रिल आरी सैंडर",
  answer: `
    <strong>सामान्य पावर टूल्स</strong> जो कारपेंटर उपयोग करते हैं:
    <ul>
      <li>इलेक्ट्रिक ड्रिल – छेद करने के लिए</li>
      <li>सर्कुलर आरी – तेज़ कटिंग के लिए</li>
      <li>जिगसॉ – घुमावदार कटिंग के लिए</li>
      <li>सैंडर – चिकनी फिनिशिंग के लिए</li>
      <li>नेल गन – जल्दी कील ठोकने के लिए</li>
    </ul>
    <br><br>
    <strong>तकनीक:</strong> पावर कटिंग, ड्रिलिंग, सैंडिंग और फास्टनिंग।
    <br><br>
    <img src="https://example.com/carpenter-power-tools.jpg" alt="Carpenter Power Tools Image" />
  `
},

// -------------------- JOINERY TECHNIQUES --------------------
{
  question: "what are common joinery techniques in carpentry?",
  keywords: "carpentry joinery dovetail mortise tenon",
  answer: `
    <strong>Common joinery techniques</strong> include:
    <ul>
      <li>Dovetail joint – strong interlocking corners</li>
      <li>Mortise and tenon – classic frame connection</li>
      <li>Lap joint – overlapping wood pieces</li>
      <li>Finger joint – decorative and strong</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong> Provide strength, durability, and aesthetics in furniture and structures.
    <br><br>
    <img src="https://example.com/carpentry-joinery.jpg" alt="Carpentry Joinery Image" />
  `
},
{
  question: "कारपेंट्री में सामान्य जोड़ तकनीकें कौन-कौन सी हैं?",
  keywords: "कारपेंट्री जोड़ डवटेल मोर्टिस टेनन",
  answer: `
    <strong>सामान्य जोड़ तकनीकें</strong> में शामिल हैं:
    <ul>
      <li>डवटेल जोड़ – मज़बूत इंटरलॉकिंग कोने</li>
      <li>मोर्टिस और टेनन – क्लासिक फ्रेम कनेक्शन</li>
      <li>लैप जोड़ – लकड़ी के टुकड़ों को ओवरलैप करना</li>
      <li>फिंगर जोड़ – सजावटी और मज़बूत</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong> फर्नीचर और संरचनाओं में मज़बूती, टिकाऊपन और सौंदर्य प्रदान करना।
    <br><br>
    <img src="https://example.com/carpentry-joinery.jpg" alt="Carpentry Joinery Image" />
  `
},
// -------------------- SAFETY PRACTICES IN CARPENTRY --------------------
{
  question: "what are safety practices in carpentry?",
  keywords: "carpentry safety practices PPE dust control tool handling",
  answer: `
    <strong>Carpentry safety practices</strong> ensure worker protection and accident prevention.
    <br><br>
    <strong>Key practices:</strong>
    <ul>
      <li>Wear PPE – helmet, gloves, safety glasses, ear protection</li>
      <li>Dust control – use masks and proper ventilation</li>
      <li>Safe tool handling – keep blades sharp, use guards</li>
      <li>Proper lifting – avoid back injuries</li>
      <li>Fire safety – store flammable materials carefully</li>
    </ul>
    <br><br>
    <strong>Why needed:</strong>
    <ul>
      <li>Prevent injuries</li>
      <li>Ensure safe working environment</li>
      <li>Comply with safety standards</li>
    </ul>
    <br><br>
    <img src="https://example.com/carpentry-safety.jpg" alt="Carpentry Safety Practices Image" />
  `
},
{
  question: "कारपेंट्री में सुरक्षा उपाय कौन-कौन से हैं?",
  keywords: "कारपेंट्री सुरक्षा उपाय पीपीई धूल नियंत्रण औज़ार",
  answer: `
    <strong>कारपेंट्री सुरक्षा उपाय</strong> मज़दूरों की सुरक्षा और दुर्घटनाओं की रोकथाम सुनिश्चित करते हैं।
    <br><br>
    <strong>मुख्य उपाय:</strong>
    <ul>
      <li>PPE पहनना – हेलमेट, दस्ताने, सुरक्षा चश्मा, कान सुरक्षा</li>
      <li>धूल नियंत्रण – मास्क और उचित वेंटिलेशन का उपयोग</li>
      <li>औज़ारों का सुरक्षित उपयोग – ब्लेड तेज़ रखना, गार्ड लगाना</li>
      <li>सही तरीके से उठाना – पीठ की चोट से बचना</li>
      <li>आग सुरक्षा – ज्वलनशील सामग्री को सावधानी से रखना</li>
    </ul>
    <br><br>
    <strong>क्यों ज़रूरी:</strong>
    <ul>
      <li>चोटों से बचाव</li>
      <li>सुरक्षित कार्य वातावरण सुनिश्चित करना</li>
      <li>सुरक्षा मानकों का पालन करना</li>
    </ul>
    <br><br>
    <img src="https://example.com/carpentry-safety.jpg" alt="Carpentry Safety Practices Image" />
  `
},
// -------------------- TRAINING & APPRENTICESHIP --------------------
{
  question: "what is carpentry apprenticeship training?",
  keywords: "carpentry apprenticeship training skill development",
  answer: `
    <strong>Carpentry apprenticeship</strong> is hands-on training under experienced carpenters.
    <br><br>
    <strong>Features:</strong>
    <ul>
      <li>Learn basic and advanced carpentry skills</li>
      <li>Work with tools and techniques</li>
      <li>Gain practical site experience</li>
      <li>Duration: usually 2–4 years</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Builds strong foundation, prepares for certification, and ensures employability.
    <br><br>
    <img src="https://example.com/carpentry-apprenticeship.jpg" alt="Carpentry Apprenticeship Image" />
  `
},
{
  question: "कारपेंट्री अप्रेंटिसशिप ट्रेनिंग क्या है?",
  keywords: "कारपेंट्री अप्रेंटिसशिप प्रशिक्षण कौशल विकास",
  answer: `
    <strong>कारपेंट्री अप्रेंटिसशिप</strong> अनुभवी कारपेंटरों के साथ हाथों-हाथ प्रशिक्षण है।
    <br><br>
    <strong>विशेषताएँ:</strong>
    <ul>
      <li>बुनियादी और उन्नत कारपेंट्री कौशल सीखना</li>
      <li>औज़ारों और तकनीकों के साथ काम करना</li>
      <li>व्यावहारिक साइट अनुभव प्राप्त करना</li>
      <li>अवधि: सामान्यतः 2–4 वर्ष</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> मज़बूत नींव बनाता है, प्रमाणन के लिए तैयार करता है और रोजगार सुनिश्चित करता है।
    <br><br>
    <img src="https://example.com/carpentry-apprenticeship.jpg" alt="Carpentry Apprenticeship Image" />
  `
},

// -------------------- CERTIFICATIONS --------------------
{
  question: "what certifications are available in carpentry?",
  keywords: "carpentry certifications skill development",
  answer: `
    <strong>Carpentry certifications</strong> validate skills and improve career opportunities.
    <br><br>
    <strong>Examples:</strong>
    <ul>
      <li>National Skill Development Corporation (NSDC) certification</li>
      <li>Trade school diplomas</li>
      <li>International certifications (e.g., OSHA safety training)</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Professional recognition, higher pay, and global opportunities.
    <br><br>
    <img src="https://example.com/carpentry-certifications.jpg" alt="Carpentry Certifications Image" />
  `
},
{
  question: "कारपेंट्री में कौन-कौन से प्रमाणपत्र उपलब्ध हैं?",
  keywords: "कारपेंट्री प्रमाणपत्र कौशल विकास",
  answer: `
    <strong>कारपेंट्री प्रमाणपत्र</strong> कौशल को मान्यता देते हैं और करियर अवसर बढ़ाते हैं।
    <br><br>
    <strong>उदाहरण:</strong>
    <ul>
      <li>नेशनल स्किल डेवलपमेंट कॉरपोरेशन (NSDC) प्रमाणपत्र</li>
      <li>ट्रेड स्कूल डिप्लोमा</li>
      <li>अंतरराष्ट्रीय प्रमाणपत्र (जैसे OSHA सुरक्षा प्रशिक्षण)</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> पेशेवर मान्यता, अधिक वेतन और वैश्विक अवसर।
    <br><br>
    <img src="https://example.com/carpentry-certifications.jpg" alt="Carpentry Certifications Image" />
  `
},

// -------------------- MODERN TOOLS & SOFTWARE --------------------
{
  question: "what modern tools and software are used in carpentry training?",
  keywords: "carpentry modern tools CAD software",
  answer: `
    <strong>Modern carpentry training</strong> includes digital tools and software.
    <br><br>
    <strong>Examples:</strong>
    <ul>
      <li>CAD (Computer-Aided Design) software – design furniture and structures</li>
      <li>3D modeling – visualize projects before building</li>
      <li>Laser measuring tools – precise dimensions</li>
      <li>Power tools training – drills, saws, sanders</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Improves accuracy, efficiency, and modern skillset.
    <br><br>
    <img src="https://example.com/carpentry-modern-tools.jpg" alt="Carpentry Modern Tools Image" />
  `
},
{
  question: "कारपेंट्री प्रशिक्षण में कौन-कौन से आधुनिक औज़ार और सॉफ़्टवेयर उपयोग होते हैं?",
  keywords: "कारपेंट्री आधुनिक औज़ार CAD सॉफ़्टवेयर",
  answer: `
    <strong>आधुनिक कारपेंट्री प्रशिक्षण</strong> में डिजिटल औज़ार और सॉफ़्टवेयर शामिल हैं।
    <br><br>
    <strong>उदाहरण:</strong>
    <ul>
      <li>CAD (कंप्यूटर-एडेड डिज़ाइन) सॉफ़्टवेयर – फर्नीचर और संरचना डिज़ाइन करना</li>
      <li>3D मॉडलिंग – निर्माण से पहले प्रोजेक्ट को विज़ुअलाइज़ करना</li>
      <li>लेज़र मापने के औज़ार – सटीक आयाम</li>
      <li>पावर टूल्स प्रशिक्षण – ड्रिल, आरी, सैंडर</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> सटीकता, दक्षता और आधुनिक कौशल में सुधार।
    <br><br>
    <img src="https://example.com/carpentry-modern-tools.jpg" alt="Carpentry Modern Tools Image" />
  `
},
// -------------------- FURNITURE MAKING --------------------
{
  question: "what career opportunities exist in furniture making?",
  keywords: "carpentry career furniture making",
  answer: `
    <strong>Furniture making</strong> is a major career path in carpentry.
    <br><br>
    <strong>Opportunities:</strong>
    <ul>
      <li>Custom furniture workshops</li>
      <li>Interior design firms</li>
      <li>Retail furniture companies</li>
      <li>Self-employed artisan work</li>
    </ul>
    <br><br>
    <strong>Skills needed:</strong> Joinery, finishing, design creativity.
    <br><br>
    <img src="https://example.com/furniture-career.jpg" alt="Furniture Making Career Image" />
  `
},
{
  question: "फर्नीचर बनाने में करियर अवसर क्या हैं?",
  keywords: "कारपेंट्री करियर फर्नीचर निर्माण",
  answer: `
    <strong>फर्नीचर निर्माण</strong> कारपेंट्री में एक प्रमुख करियर मार्ग है।
    <br><br>
    <strong>अवसर:</strong>
    <ul>
      <li>कस्टम फर्नीचर वर्कशॉप</li>
      <li>इंटीरियर डिज़ाइन कंपनियाँ</li>
      <li>रिटेल फर्नीचर कंपनियाँ</li>
      <li>स्व-रोज़गार कारीगर कार्य</li>
    </ul>
    <br><br>
    <strong>आवश्यक कौशल:</strong> जॉइनरी, फिनिशिंग, डिज़ाइन क्रिएटिविटी।
    <br><br>
    <img src="https://example.com/furniture-career.jpg" alt="Furniture Making Career Image" />
  `
},

// -------------------- CONSTRUCTION INDUSTRY --------------------
{
  question: "what career opportunities exist in construction carpentry?",
  keywords: "carpentry career construction industry",
  answer: `
    <strong>Construction carpentry</strong> offers jobs in building and infrastructure projects.
    <br><br>
    <strong>Opportunities:</strong>
    <ul>
      <li>Residential housing projects</li>
      <li>Commercial buildings</li>
      <li>Roads and bridges</li>
      <li>Government infrastructure</li>
    </ul>
    <br><br>
    <strong>Skills needed:</strong> Structural framing, safety practices, teamwork.
    <br><br>
    <img src="https://example.com/construction-career.jpg" alt="Construction Carpentry Career Image" />
  `
},
{
  question: "निर्माण उद्योग में कारपेंट्री करियर अवसर क्या हैं?",
  keywords: "कारपेंट्री करियर निर्माण उद्योग",
  answer: `
    <strong>निर्माण कारपेंट्री</strong> भवन और अवसंरचना परियोजनाओं में नौकरियाँ प्रदान करता है।
    <br><br>
    <strong>अवसर:</strong>
    <ul>
      <li>आवासीय परियोजनाएँ</li>
      <li>वाणिज्यिक भवन</li>
      <li>सड़कें और पुल</li>
      <li>सरकारी अवसंरचना</li>
    </ul>
    <br><br>
    <strong>आवश्यक कौशल:</strong> संरचनात्मक फ्रेमिंग, सुरक्षा उपाय, टीमवर्क।
    <br><br>
    <img src="https://example.com/construction-career.jpg" alt="Construction Carpentry Career Image" />
  `
},

// -------------------- INTERIOR DESIGN & RESTORATION --------------------
{
  question: "what career opportunities exist in interior design and restoration?",
  keywords: "carpentry career interior design restoration",
  answer: `
    <strong>Interior design and restoration carpentry</strong> focuses on aesthetics and heritage.
    <br><br>
    <strong>Opportunities:</strong>
    <ul>
      <li>Interior design firms</li>
      <li>Heritage building restoration</li>
      <li>Custom decorative carpentry</li>
      <li>Luxury furniture and fittings</li>
    </ul>
    <br><br>
    <strong>Skills needed:</strong> Fine finishing, creativity, historical knowledge.
    <br><br>
    <img src="https://example.com/interior-career.jpg" alt="Interior Design Career Image" />
  `
},
{
  question: "इंटीरियर डिज़ाइन और रेस्टोरेशन में करियर अवसर क्या हैं?",
  keywords: "कारपेंट्री करियर इंटीरियर डिज़ाइन रेस्टोरेशन",
  answer: `
    <strong>इंटीरियर डिज़ाइन और रेस्टोरेशन कारपेंट्री</strong> सौंदर्य और विरासत पर केंद्रित है।
    <br><br>
    <strong>अवसर:</strong>
    <ul>
      <li>इंटीरियर डिज़ाइन कंपनियाँ</li>
      <li>विरासत भवनों का पुनर्निर्माण</li>
      <li>कस्टम सजावटी कारपेंट्री</li>
      <li>लक्ज़री फर्नीचर और फिटिंग्स</li>
    </ul>
    <br><br>
    <strong>आवश्यक कौशल:</strong> बारीक फिनिशिंग, क्रिएटिविटी, ऐतिहासिक ज्ञान।
    <br><br>
    <img src="https://example.com/interior-career.jpg" alt="Interior Design Career Image" />
  `
},
// -------------------- PAINTING WORK --------------------
{
  question: "what is painting work in construction?",
  keywords: "painting work construction process types",
  answer: `
    <strong>Painting work</strong> is a finishing activity in construction that provides aesthetics and protection.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Surface preparation – cleaning, sanding, putty</li>
      <li>Primer application – ensures adhesion</li>
      <li>Paint application – brush, roller, spray</li>
      <li>Finishing – second coat, polishing</li>
    </ul>
    <br><br>
    <strong>Types:</strong> Emulsion, enamel, textured, oil-based paints.
    <br><br>
    <strong>Tools:</strong> Brushes, rollers, sprayers, sandpaper.
    <br><br>
    <img src="https://example.com/painting-work.jpg" alt="Painting Work Image" />
  `
},
{
  question: "निर्माण में पेंटिंग कार्य क्या है?",
  keywords: "निर्माण पेंटिंग कार्य प्रक्रिया प्रकार",
  answer: `
    <strong>पेंटिंग कार्य</strong> निर्माण में एक फिनिशिंग गतिविधि है जो सौंदर्य और सुरक्षा प्रदान करती है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>सतह की तैयारी – सफाई, सैंडिंग, पुट्टी</li>
      <li>प्राइमर लगाना – चिपकने की क्षमता सुनिश्चित करना</li>
      <li>पेंट लगाना – ब्रश, रोलर, स्प्रे</li>
      <li>फिनिशिंग – दूसरा कोट, पॉलिशिंग</li>
    </ul>
    <br><br>
    <strong>प्रकार:</strong> इमल्शन, एनामेल, टेक्सचर्ड, ऑयल-बेस्ड पेंट।
    <br><br>
    <strong>औज़ार:</strong> ब्रश, रोलर, स्प्रेयर, सैंडपेपर।
    <br><br>
    <img src="https://example.com/painting-work.jpg" alt="Painting Work Image" />
  `
},

// -------------------- FALSE CEILING WORK --------------------
{
  question: "what is false ceiling work in construction?",
  keywords: "false ceiling work construction process types",
  answer: `
    <strong>False ceiling work</strong> is a secondary ceiling below the main roof for aesthetics and utility.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Framework – metal channels fixed</li>
      <li>Suspension – wires hold framework</li>
      <li>Panel fixing – gypsum/POP/PVC boards</li>
      <li>Finishing – joint treatment, painting, lighting</li>
    </ul>
    <br><br>
    <strong>Materials:</strong> Gypsum, POP, PVC, wood.
    <br><br>
    <strong>Types:</strong> Grid ceiling, concealed ceiling, POP designs, wooden ceiling.
    <br><br>
    <img src="https://example.com/false-ceiling.jpg" alt="False Ceiling Work Image" />
  `
},
{
  question: "निर्माण में फॉल्स सीलिंग कार्य क्या है?",
  keywords: "निर्माण फॉल्स सीलिंग कार्य प्रक्रिया प्रकार",
  answer: `
    <strong>फॉल्स सीलिंग कार्य</strong> मुख्य छत के नीचे एक द्वितीयक छत होती है जो सौंदर्य और उपयोगिता प्रदान करती है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>फ्रेमवर्क – मेटल चैनल लगाना</li>
      <li>सस्पेंशन – तारों से फ्रेमवर्क को पकड़ना</li>
      <li>पैनल लगाना – जिप्सम/पीओपी/पीवीसी बोर्ड</li>
      <li>फिनिशिंग – जोड़ उपचार, पेंटिंग, लाइटिंग</li>
    </ul>
    <br><br>
    <strong>सामग्री:</strong> जिप्सम, पीओपी, पीवीसी, लकड़ी।
    <br><br>
    <strong>प्रकार:</strong> ग्रिड सीलिंग, कंसील्ड सीलिंग, पीओपी डिज़ाइन, लकड़ी की सीलिंग।
    <br><br>
    <img src="https://example.com/false-ceiling.jpg" alt="False Ceiling Work Image" />
  `
},
// -------------------- TILING WORK --------------------
{
  question: "what is tiling work in construction?",
  keywords: "tiling work construction ceramic marble installation",
  answer: `
    <strong>Tiling work</strong> involves fixing tiles on floors and walls for aesthetics and durability.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Surface preparation – leveling and cleaning</li>
      <li>Mortar or adhesive application</li>
      <li>Tile fixing – ceramic, marble, granite, vitrified</li>
      <li>Grouting – filling joints</li>
      <li>Finishing – polishing and sealing</li>
    </ul>
    <br><br>
    <strong>Types:</strong> Ceramic, vitrified, marble, granite, mosaic tiles.
    <br><br>
    <img src="https://example.com/tiling-work.jpg" alt="Tiling Work Image" />
  `
},
{
  question: "निर्माण में टाइलिंग कार्य क्या है?",
  keywords: "निर्माण टाइलिंग कार्य सिरेमिक संगमरमर इंस्टॉलेशन",
  answer: `
    <strong>टाइलिंग कार्य</strong> फर्श और दीवारों पर टाइलें लगाने का काम है जो सौंदर्य और टिकाऊपन प्रदान करता है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>सतह की तैयारी – लेवलिंग और सफाई</li>
      <li>मोर्टार या एडहेसिव लगाना</li>
      <li>टाइल लगाना – सिरेमिक, संगमरमर, ग्रेनाइट, विट्रिफाइड</li>
      <li>ग्राउटिंग – जोड़ भरना</li>
      <li>फिनिशिंग – पॉलिशिंग और सीलिंग</li>
    </ul>
    <br><br>
    <strong>प्रकार:</strong> सिरेमिक, विट्रिफाइड, संगमरमर, ग्रेनाइट, मोज़ेक टाइलें।
    <br><br>
    <img src="https://example.com/tiling-work.jpg" alt="Tiling Work Image" />
  `
},

// -------------------- FLOORING WORK --------------------
{
  question: "what is flooring work in construction?",
  keywords: "flooring work construction wooden marble installation",
  answer: `
    <strong>Flooring work</strong> involves laying materials to create durable and aesthetic floors.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Base preparation – leveling and compacting</li>
      <li>Material installation – wood, marble, tiles, vinyl</li>
      <li>Finishing – polishing, sealing, varnishing</li>
    </ul>
    <br><br>
    <strong>Types:</strong> Wooden flooring, marble flooring, vinyl flooring, laminate flooring.
    <br><br>
    <img src="https://example.com/flooring-work.jpg" alt="Flooring Work Image" />
  `
},
{
  question: "निर्माण में फ्लोरिंग कार्य क्या है?",
  keywords: "निर्माण फ्लोरिंग कार्य लकड़ी संगमरमर इंस्टॉलेशन",
  answer: `
    <strong>फ्लोरिंग कार्य</strong> टिकाऊ और आकर्षक फर्श बनाने के लिए सामग्री बिछाने का काम है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>बेस की तैयारी – लेवलिंग और कॉम्पैक्टिंग</li>
      <li>सामग्री लगाना – लकड़ी, संगमरमर, टाइलें, विनाइल</li>
      <li>फिनिशिंग – पॉलिशिंग, सीलिंग, वार्निशिंग</li>
    </ul>
    <br><br>
    <strong>प्रकार:</strong> लकड़ी का फर्श, संगमरमर का फर्श, विनाइल फर्श, लैमिनेट फर्श।
    <br><br>
    <img src="https://example.com/flooring-work.jpg" alt="Flooring Work Image" />
  `
},
// -------------------- PLUMBING WORK --------------------
{
  question: "what is plumbing work in construction?",
  keywords: "plumbing work construction water supply drainage fittings",
  answer: `
    <strong>Plumbing work</strong> ensures water supply, drainage, and sanitation in buildings.
    <br><br>
    <strong>Scope:</strong>
    <ul>
      <li>Water supply lines – pipes for drinking water</li>
      <li>Drainage system – sewage and wastewater disposal</li>
      <li>Fixtures – taps, sinks, toilets, showers</li>
      <li>Pump installation – for water pressure</li>
      <li>Fire safety – sprinkler systems</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Layout planning – pipe routes and fixture positions</li>
      <li>Pipe installation – PVC, CPVC, GI, copper pipes</li>
      <li>Leak testing – pressure tests</li>
      <li>Finishing – fixing taps, sanitary fittings</li>
    </ul>
    <br><br>
    <strong>Tools:</strong> Pipe wrench, cutters, threaders, sealants.
    <br><br>
    <img src="https://example.com/plumbing-work.jpg" alt="Plumbing Work Image" />
  `
},
{
  question: "निर्माण में प्लंबिंग कार्य क्या है?",
  keywords: "निर्माण प्लंबिंग कार्य जल आपूर्ति ड्रेनेज फिटिंग्स",
  answer: `
    <strong>प्लंबिंग कार्य</strong> भवनों में जल आपूर्ति, ड्रेनेज और स्वच्छता सुनिश्चित करता है।
    <br><br>
    <strong>क्षेत्र:</strong>
    <ul>
      <li>जल आपूर्ति लाइनें – पीने के पानी के पाइप</li>
      <li>ड्रेनेज सिस्टम – सीवेज और अपशिष्ट जल का निपटान</li>
      <li>फिक्स्चर – नल, सिंक, शौचालय, शॉवर</li>
      <li>पंप इंस्टॉलेशन – जल दबाव के लिए</li>
      <li>फायर सेफ्टी – स्प्रिंकलर सिस्टम</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>लेआउट प्लानिंग – पाइप मार्ग और फिक्स्चर की स्थिति</li>
      <li>पाइप इंस्टॉलेशन – PVC, CPVC, GI, कॉपर पाइप</li>
      <li>लीक टेस्टिंग – प्रेशर टेस्ट</li>
      <li>फिनिशिंग – नल और सैनिटरी फिटिंग लगाना</li>
    </ul>
    <br><br>
    <strong>औज़ार:</strong> पाइप रिंच, कटर, थ्रेडर, सीलेंट।
    <br><br>
    <img src="https://example.com/plumbing-work.jpg" alt="Plumbing Work Image" />
  `
},

// -------------------- ELECTRICAL WORK --------------------
{
  question: "what is electrical work in construction?",
  keywords: "electrical work construction wiring fittings safety",
  answer: `
    <strong>Electrical work</strong> provides power distribution, lighting, and safety systems in buildings.
    <br><br>
    <strong>Scope:</strong>
    <ul>
      <li>Wiring – concealed and open wiring</li>
      <li>Switches and sockets – power outlets</li>
      <li>Lighting – LED, tube lights, decorative fixtures</li>
      <li>Safety systems – earthing, circuit breakers, surge protectors</li>
      <li>HVAC and appliances – electrical connections</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Planning – load calculation and circuit design</li>
      <li>Conduit installation – PVC/metal pipes for wires</li>
      <li>Wiring – phase, neutral, earth connections</li>
      <li>Testing – insulation resistance, continuity</li>
      <li>Finishing – fixing switches, lights, fans</li>
    </ul>
    <br><br>
    <strong>Tools:</strong> Tester, pliers, screwdrivers, multimeter, drill machine.
    <br><br>
    <img src="https://example.com/electrical-work.jpg" alt="Electrical Work Image" />
  `
},
{
  question: "निर्माण में इलेक्ट्रिकल कार्य क्या है?",
  keywords: "निर्माण इलेक्ट्रिकल कार्य वायरिंग फिटिंग्स सुरक्षा",
  answer: `
    <strong>इलेक्ट्रिकल कार्य</strong> भवनों में बिजली वितरण, लाइटिंग और सुरक्षा सिस्टम प्रदान करता है।
    <br><br>
    <strong>क्षेत्र:</strong>
    <ul>
      <li>वायरिंग – कंसील्ड और ओपन वायरिंग</li>
      <li>स्विच और सॉकेट – पावर आउटलेट</li>
      <li>लाइटिंग – LED, ट्यूब लाइट, सजावटी फिटिंग्स</li>
      <li>सुरक्षा सिस्टम – अर्थिंग, सर्किट ब्रेकर, सर्ज प्रोटेक्टर</li>
      <li>HVAC और उपकरण – इलेक्ट्रिकल कनेक्शन</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>प्लानिंग – लोड कैलकुलेशन और सर्किट डिज़ाइन</li>
      <li>कंडुइट इंस्टॉलेशन – PVC/मेटल पाइप में वायर</li>
      <li>वायरिंग – फेज़, न्यूट्रल, अर्थ कनेक्शन</li>
      <li>टेस्टिंग – इंसुलेशन रेजिस्टेंस, कंटिन्युटी</li>
      <li>फिनिशिंग – स्विच, लाइट, पंखे लगाना</li>
    </ul>
    <br><br>
    <strong>औज़ार:</strong> टेस्टर, प्लायर, स्क्रूड्राइवर, मल्टीमीटर, ड्रिल मशीन।
    <br><br>
    <img src="https://example.com/electrical-work.jpg" alt="Electrical Work Image" />
  `
},
// -------------------- HVAC WORK --------------------
{
  question: "what is HVAC work in construction?",
  keywords: "HVAC work construction heating ventilation air conditioning",
  answer: `
    <strong>HVAC work</strong> ensures indoor comfort by controlling temperature, air quality, and ventilation.
    <br><br>
    <strong>Scope:</strong>
    <ul>
      <li>Heating – boilers, furnaces, heat pumps</li>
      <li>Ventilation – ducts, exhaust fans, fresh air systems</li>
      <li>Air Conditioning – split units, central AC, chillers</li>
      <li>Controls – thermostats, sensors, automation</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Design – load calculation and duct layout</li>
      <li>Installation – ducts, pipes, units</li>
      <li>Testing – airflow, temperature, efficiency</li>
      <li>Maintenance – filter cleaning, servicing</li>
    </ul>
    <br><br>
    <img src="https://example.com/hvac-work.jpg" alt="HVAC Work Image" />
  `
},
{
  question: "निर्माण में HVAC कार्य क्या है?",
  keywords: "निर्माण HVAC कार्य हीटिंग वेंटिलेशन एयर कंडीशनिंग",
  answer: `
    <strong>HVAC कार्य</strong> इनडोर आराम सुनिश्चित करता है, तापमान, वायु गुणवत्ता और वेंटिलेशन को नियंत्रित करके।
    <br><br>
    <strong>क्षेत्र:</strong>
    <ul>
      <li>हीटिंग – बॉयलर, फर्नेस, हीट पंप</li>
      <li>वेंटिलेशन – डक्ट, एग्जॉस्ट फैन, फ्रेश एयर सिस्टम</li>
      <li>एयर कंडीशनिंग – स्प्लिट यूनिट, सेंट्रल AC, चिलर</li>
      <li>कंट्रोल – थर्मोस्टैट, सेंसर, ऑटोमेशन</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>डिज़ाइन – लोड कैलकुलेशन और डक्ट लेआउट</li>
      <li>इंस्टॉलेशन – डक्ट, पाइप, यूनिट लगाना</li>
      <li>टेस्टिंग – एयरफ्लो, तापमान, दक्षता</li>
      <li>मेंटेनेंस – फ़िल्टर सफाई, सर्विसिंग</li>
    </ul>
    <br><br>
    <img src="https://example.com/hvac-work.jpg" alt="HVAC Work Image" />
  `
},

// -------------------- FIRE SAFETY SYSTEMS --------------------
{
  question: "what are fire safety systems in construction?",
  keywords: "fire safety systems construction sprinklers alarms extinguishers",
  answer: `
    <strong>Fire safety systems</strong> protect buildings and occupants from fire hazards.
    <br><br>
    <strong>Components:</strong>
    <ul>
      <li>Fire alarms – smoke and heat detectors</li>
      <li>Sprinkler systems – automatic water discharge</li>
      <li>Fire extinguishers – portable suppression tools</li>
      <li>Emergency exits – signage and lighting</li>
      <li>Fire-resistant materials – doors, walls, coatings</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Risk assessment – identify fire-prone areas</li>
      <li>System design – alarms, sprinklers, exits</li>
      <li>Installation – detectors, pipes, extinguishers</li>
      <li>Testing – drills, alarm checks, water flow</li>
    </ul>
    <br><br>
    <img src="https://example.com/fire-safety.jpg" alt="Fire Safety Systems Image" />
  `
},
{
  question: "निर्माण में फायर सेफ्टी सिस्टम क्या हैं?",
  keywords: "निर्माण फायर सेफ्टी सिस्टम स्प्रिंकलर अलार्म अग्निशामक",
  answer: `
    <strong>फायर सेफ्टी सिस्टम</strong> भवनों और निवासियों को आग के खतरों से बचाते हैं।
    <br><br>
    <strong>घटक:</strong>
    <ul>
      <li>फायर अलार्म – धुआँ और ताप सेंसर</li>
      <li>स्प्रिंकलर सिस्टम – स्वतः जल छिड़काव</li>
      <li>अग्निशामक – पोर्टेबल आग बुझाने के उपकरण</li>
      <li>आपातकालीन निकास – संकेत और लाइटिंग</li>
      <li>फायर-रेसिस्टेंट सामग्री – दरवाज़े, दीवारें, कोटिंग</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>जोखिम मूल्यांकन – आग-प्रवण क्षेत्रों की पहचान</li>
      <li>सिस्टम डिज़ाइन – अलार्म, स्प्रिंकलर, निकास</li>
      <li>इंस्टॉलेशन – सेंसर, पाइप, अग्निशामक लगाना</li>
      <li>टेस्टिंग – ड्रिल, अलार्म चेक, जल प्रवाह</li>
    </ul>
    <br><br>
    <img src="https://example.com/fire-safety.jpg" alt="Fire Safety Systems Image" />
  `
},
// -------------------- PLASTERING WORK --------------------
{
  question: "what is plastering work in construction?",
  keywords: "plastering work construction wall finish",
  answer: `
    <strong>Plastering work</strong> provides a smooth protective finish to walls and ceilings.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Surface preparation – cleaning and wetting</li>
      <li>Application – cement plaster or gypsum plaster</li>
      <li>Levelling – using trowel and straight edge</li>
      <li>Finishing – smooth or textured surface</li>
    </ul>
    <br><br>
    <strong>Types:</strong> Cement plaster, gypsum plaster, lime plaster.
    <br><br>
    <img src="https://example.com/plastering-work.jpg" alt="Plastering Work Image" />
  `
},
{
  question: "निर्माण में प्लास्टरिंग कार्य क्या है?",
  keywords: "निर्माण प्लास्टरिंग कार्य दीवार फिनिश",
  answer: `
    <strong>प्लास्टरिंग कार्य</strong> दीवारों और छतों को चिकनी और सुरक्षात्मक फिनिश प्रदान करता है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>सतह की तैयारी – सफाई और गीला करना</li>
      <li>लगाना – सीमेंट प्लास्टर या जिप्सम प्लास्टर</li>
      <li>लेवलिंग – ट्रॉवेल और स्ट्रेट एज से</li>
      <li>फिनिशिंग – चिकनी या टेक्सचर्ड सतह</li>
    </ul>
    <br><br>
    <strong>प्रकार:</strong> सीमेंट प्लास्टर, जिप्सम प्लास्टर, चूना प्लास्टर।
    <br><br>
    <img src="https://example.com/plastering-work.jpg" alt="Plastering Work Image" />
  `
},

// -------------------- CLADDING WORK --------------------
{
  question: "what is cladding work in construction?",
  keywords: "cladding work construction exterior finish",
  answer: `
    <strong>Cladding work</strong> involves covering building exteriors with protective and decorative materials.
    <br><br>
    <strong>Materials:</strong> Stone, marble, granite, aluminum composite panels (ACP), glass.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Framework installation – support system</li>
      <li>Panel fixing – stone, ACP, or glass panels</li>
      <li>Joint sealing – weatherproofing</li>
      <li>Finishing – polishing and alignment</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Weather resistance, thermal insulation, modern aesthetics.
    <br><br>
    <img src="https://example.com/cladding-work.jpg" alt="Cladding Work Image" />
  `
},
{
  question: "निर्माण में क्लैडिंग कार्य क्या है?",
  keywords: "निर्माण क्लैडिंग कार्य बाहरी फिनिश",
  answer: `
    <strong>क्लैडिंग कार्य</strong> भवन के बाहरी हिस्से को सुरक्षात्मक और सजावटी सामग्री से ढकने का काम है।
    <br><br>
    <strong>सामग्री:</strong> पत्थर, संगमरमर, ग्रेनाइट, एल्युमिनियम कंपोज़िट पैनल (ACP), ग्लास।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>फ्रेमवर्क इंस्टॉलेशन – सपोर्ट सिस्टम</li>
      <li>पैनल लगाना – पत्थर, ACP या ग्लास पैनल</li>
      <li>जोड़ सील करना – वेदरप्रूफिंग</li>
      <li>फिनिशिंग – पॉलिशिंग और अलाइनमेंट</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> मौसम प्रतिरोध, थर्मल इंसुलेशन, आधुनिक सौंदर्य।
    <br><br>
    <img src="https://example.com/cladding-work.jpg" alt="Cladding Work Image" />
  `
},

// -------------------- FACADE WORK --------------------
{
  question: "what is facade work in construction?",
  keywords: "facade work construction building exterior",
  answer: `
    <strong>Facade work</strong> refers to the design and installation of the building’s outer face.
    <br><br>
    <strong>Types:</strong> Glass facades, ACP facades, stone facades, ventilated facades.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Structural framework installation</li>
      <li>Panel or glass fixing</li>
      <li>Joint sealing and insulation</li>
      <li>Finishing – alignment and polishing</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Modern aesthetics, energy efficiency, weather protection.
    <br><br>
    <img src="https://example.com/facade-work.jpg" alt="Facade Work Image" />
  `
},
{
  question: "निर्माण में फसाड कार्य क्या है?",
  keywords: "निर्माण फसाड कार्य भवन बाहरी",
  answer: `
    <strong>फसाड कार्य</strong> भवन के बाहरी चेहरे की डिज़ाइन और इंस्टॉलेशन को कहते हैं।
    <br><br>
    <strong>प्रकार:</strong> ग्लास फसाड, ACP फसाड, पत्थर फसाड, वेंटिलेटेड फसाड।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>संरचनात्मक फ्रेमवर्क इंस्टॉलेशन</li>
      <li>पैनल या ग्लास लगाना</li>
      <li>जोड़ सीलिंग और इंसुलेशन</li>
      <li>फिनिशिंग – अलाइनमेंट और पॉलिशिंग</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> आधुनिक सौंदर्य, ऊर्जा दक्षता, मौसम सुरक्षा।
    <br><br>
    <img src="https://example.com/facade-work.jpg" alt="Facade Work Image" />
  `
},
// -------------------- ROOFING WORK --------------------
{
  question: "what is roofing work in construction?",
  keywords: "roofing work construction RCC metal tiles",
  answer: `
    <strong>Roofing work</strong> provides shelter, protection, and structural stability to buildings.
    <br><br>
    <strong>Types:</strong>
    <ul>
      <li>RCC roof – reinforced concrete slab</li>
      <li>Metal roofing – steel or aluminum sheets</li>
      <li>Tiled roofing – clay, ceramic, or concrete tiles</li>
      <li>Wooden roofing – traditional timber structures</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Structural framework installation</li>
      <li>Roof covering – slabs, sheets, or tiles</li>
      <li>Insulation – thermal and acoustic</li>
      <li>Finishing – waterproofing and painting</li>
    </ul>
    <br><br>
    <img src="https://example.com/roofing-work.jpg" alt="Roofing Work Image" />
  `
},
{
  question: "निर्माण में रूफिंग कार्य क्या है?",
  keywords: "निर्माण रूफिंग कार्य आरसीसी मेटल टाइल्स",
  answer: `
    <strong>रूफिंग कार्य</strong> भवनों को आश्रय, सुरक्षा और संरचनात्मक स्थिरता प्रदान करता है।
    <br><br>
    <strong>प्रकार:</strong>
    <ul>
      <li>RCC छत – प्रबलित कंक्रीट स्लैब</li>
      <li>मेटल रूफिंग – स्टील या एल्युमिनियम शीट</li>
      <li>टाइल्ड रूफिंग – मिट्टी, सिरेमिक या कंक्रीट टाइलें</li>
      <li>लकड़ी की छत – पारंपरिक टिम्बर संरचना</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>संरचनात्मक फ्रेमवर्क इंस्टॉलेशन</li>
      <li>छत कवरिंग – स्लैब, शीट या टाइलें</li>
      <li>इंसुलेशन – थर्मल और ध्वनिक</li>
      <li>फिनिशिंग – वाटरप्रूफिंग और पेंटिंग</li>
    </ul>
    <br><br>
    <img src="https://example.com/roofing-work.jpg" alt="Roofing Work Image" />
  `
},

// -------------------- WATERPROOFING WORK --------------------
{
  question: "what is waterproofing work in construction?",
  keywords: "waterproofing work construction bitumen membrane",
  answer: `
    <strong>Waterproofing work</strong> prevents water leakage and protects structures from dampness.
    <br><br>
    <strong>Methods:</strong>
    <ul>
      <li>Bitumen coating – hot or cold applied</li>
      <li>Membrane waterproofing – PVC, EPDM, HDPE sheets</li>
      <li>Chemical waterproofing – liquid sealants</li>
      <li>Cementitious waterproofing – slurry coating</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Surface cleaning and preparation</li>
      <li>Application of waterproofing layer</li>
      <li>Joint sealing and curing</li>
      <li>Testing – water ponding test</li>
    </ul>
    <br><br>
    <strong>Applications:</strong> Roofs, basements, bathrooms, water tanks.
    <br><br>
    <img src="https://example.com/waterproofing-work.jpg" alt="Waterproofing Work Image" />
  `
},
{
  question: "निर्माण में वाटरप्रूफिंग कार्य क्या है?",
  keywords: "निर्माण वाटरप्रूफिंग कार्य बिटुमेन मेम्ब्रेन",
  answer: `
    <strong>वाटरप्रूफिंग कार्य</strong> पानी का रिसाव रोकता है और संरचनाओं को नमी से बचाता है।
    <br><br>
    <strong>विधियाँ:</strong>
    <ul>
      <li>बिटुमेन कोटिंग – गर्म या ठंडा लगाया जाता है</li>
      <li>मेम्ब्रेन वाटरप्रूफिंग – PVC, EPDM, HDPE शीट</li>
      <li>केमिकल वाटरप्रूफिंग – लिक्विड सीलेंट</li>
      <li>सीमेंटिशियस वाटरप्रूफिंग – स्लरी कोटिंग</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>सतह की सफाई और तैयारी</li>
      <li>वाटरप्रूफिंग लेयर लगाना</li>
      <li>जोड़ सीलिंग और क्योरिंग</li>
      <li>टेस्टिंग – वाटर पोंडिंग टेस्ट</li>
    </ul>
    <br><br>
    <strong>उपयोग:</strong> छत, बेसमेंट, बाथरूम, पानी की टंकी।
    <br><br>
    <img src="https://example.com/waterproofing-work.jpg" alt="Waterproofing Work Image" />
  `
},
// -------------------- LANDSCAPING WORK --------------------
{
  question: "what is landscaping work in construction?",
  keywords: "landscaping work construction garden paving",
  answer: `
    <strong>Landscaping work</strong> enhances outdoor spaces with greenery, paving, and decorative elements.
    <br><br>
    <strong>Scope:</strong>
    <ul>
      <li>Garden development – lawns, plants, trees</li>
      <li>Paving – walkways, driveways, stone paths</li>
      <li>Water features – fountains, ponds</li>
      <li>Outdoor furniture – benches, pergolas</li>
      <li>Lighting – decorative and functional</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Site preparation – leveling and soil treatment</li>
      <li>Planting – grass, shrubs, trees</li>
      <li>Paving installation – stone, concrete, tiles</li>
      <li>Finishing – irrigation, lighting setup</li>
    </ul>
    <br><br>
    <img src="https://example.com/landscaping-work.jpg" alt="Landscaping Work Image" />
  `
},
{
  question: "निर्माण में लैंडस्केपिंग कार्य क्या है?",
  keywords: "निर्माण लैंडस्केपिंग कार्य बगीचा पक्का रास्ता",
  answer: `
    <strong>लैंडस्केपिंग कार्य</strong> बाहरी स्थानों को हरियाली, पक्का रास्ता और सजावटी तत्वों से सुंदर बनाता है।
    <br><br>
    <strong>क्षेत्र:</strong>
    <ul>
      <li>बगीचा विकास – लॉन, पौधे, पेड़</li>
      <li>पक्का रास्ता – वॉकवे, ड्राइववे, पत्थर के पथ</li>
      <li>जल संरचनाएँ – फव्वारे, तालाब</li>
      <li>बाहरी फर्नीचर – बेंच, पर्गोला</li>
      <li>लाइटिंग – सजावटी और कार्यात्मक</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>साइट तैयारी – लेवलिंग और मिट्टी उपचार</li>
      <li>पौधारोपण – घास, झाड़ियाँ, पेड़</li>
      <li>पक्का रास्ता लगाना – पत्थर, कंक्रीट, टाइलें</li>
      <li>फिनिशिंग – सिंचाई और लाइटिंग सेटअप</li>
    </ul>
    <br><br>
    <img src="https://example.com/landscaping-work.jpg" alt="Landscaping Work Image" />
  `
},

// -------------------- EXTERNAL WORKS --------------------
{
  question: "what are external works in construction?",
  keywords: "external works construction boundary wall paving lighting",
  answer: `
    <strong>External works</strong> include site development and outdoor infrastructure around buildings.
    <br><br>
    <strong>Scope:</strong>
    <ul>
      <li>Boundary walls and fencing</li>
      <li>Driveways and parking areas</li>
      <li>Stormwater drainage</li>
      <li>Outdoor lighting systems</li>
      <li>Hardscaping – stone, concrete, tiles</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Site survey and layout</li>
      <li>Construction of walls, pavements</li>
      <li>Drainage installation</li>
      <li>Lighting and finishing</li>
    </ul>
    <br><br>
    <img src="https://example.com/external-works.jpg" alt="External Works Image" />
  `
},
{
  question: "निर्माण में एक्सटर्नल वर्क्स क्या हैं?",
  keywords: "निर्माण एक्सटर्नल वर्क्स बाउंड्री वॉल पक्का रास्ता लाइटिंग",
  answer: `
    <strong>एक्सटर्नल वर्क्स</strong> भवनों के आसपास साइट विकास और बाहरी अवसंरचना को शामिल करते हैं।
    <br><br>
    <strong>क्षेत्र:</strong>
    <ul>
      <li>बाउंड्री वॉल और फेंसिंग</li>
      <li>ड्राइववे और पार्किंग क्षेत्र</li>
      <li>स्टॉर्मवॉटर ड्रेनेज</li>
      <li>बाहरी लाइटिंग सिस्टम</li>
      <li>हार्डस्केपिंग – पत्थर, कंक्रीट, टाइलें</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>साइट सर्वे और लेआउट</li>
      <li>दीवारों और पक्के रास्तों का निर्माण</li>
      <li>ड्रेनेज इंस्टॉलेशन</li>
      <li>लाइटिंग और फिनिशिंग</li>
    </ul>
    <br><br>
    <img src="https://example.com/external-works.jpg" alt="External Works Image" />
  `
},
// -------------------- WALL PANELING --------------------
{
  question: "what is wall paneling work in construction?",
  keywords: "wall paneling construction interior finish",
  answer: `
    <strong>Wall paneling</strong> adds decorative and protective layers to interior walls.
    <br><br>
    <strong>Materials:</strong> Wood, MDF, PVC, gypsum, fabric panels.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Framework installation</li>
      <li>Panel fixing – adhesive or screws</li>
      <li>Finishing – polishing, painting, laminating</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Aesthetic appeal, insulation, soundproofing.
    <br><br>
    <img src="https://example.com/wall-paneling.jpg" alt="Wall Paneling Image" />
  `
},
{
  question: "निर्माण में वॉल पैनलिंग कार्य क्या है?",
  keywords: "निर्माण वॉल पैनलिंग इंटीरियर फिनिश",
  answer: `
    <strong>वॉल पैनलिंग</strong> आंतरिक दीवारों को सजावटी और सुरक्षात्मक परत देती है।
    <br><br>
    <strong>सामग्री:</strong> लकड़ी, MDF, PVC, जिप्सम, फैब्रिक पैनल।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>फ्रेमवर्क इंस्टॉलेशन</li>
      <li>पैनल लगाना – एडहेसिव या स्क्रू से</li>
      <li>फिनिशिंग – पॉलिशिंग, पेंटिंग, लैमिनेटिंग</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> सौंदर्य, इंसुलेशन, साउंडप्रूफिंग।
    <br><br>
    <img src="https://example.com/wall-paneling.jpg" alt="Wall Paneling Image" />
  `
},

// -------------------- PARTITIONS --------------------
{
  question: "what is partition work in interior finishing?",
  keywords: "partition work construction gypsum glass wood",
  answer: `
    <strong>Partition work</strong> divides interior spaces into functional areas.
    <br><br>
    <strong>Materials:</strong> Gypsum boards, glass panels, wooden frames, aluminum partitions.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Framework installation – metal or wood</li>
      <li>Panel fixing – gypsum, glass, or wood</li>
      <li>Finishing – painting, laminating</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Space management, privacy, aesthetics.
    <br><br>
    <img src="https://example.com/partition-work.jpg" alt="Partition Work Image" />
  `
},
{
  question: "इंटीरियर फिनिशिंग में पार्टिशन कार्य क्या है?",
  keywords: "इंटीरियर पार्टिशन कार्य जिप्सम ग्लास लकड़ी",
  answer: `
    <strong>पार्टिशन कार्य</strong> आंतरिक स्थानों को कार्यात्मक क्षेत्रों में विभाजित करता है।
    <br><br>
    <strong>सामग्री:</strong> जिप्सम बोर्ड, ग्लास पैनल, लकड़ी के फ्रेम, एल्युमिनियम पार्टिशन।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>फ्रेमवर्क इंस्टॉलेशन – मेटल या लकड़ी</li>
      <li>पैनल लगाना – जिप्सम, ग्लास या लकड़ी</li>
      <li>फिनिशिंग – पेंटिंग, लैमिनेटिंग</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> स्पेस मैनेजमेंट, प्राइवेसी, सौंदर्य।
    <br><br>
    <img src="https://example.com/partition-work.jpg" alt="Partition Work Image" />
  `
},

// -------------------- DECORATIVE & ACOUSTIC ELEMENTS --------------------
{
  question: "what are decorative and acoustic treatments in interiors?",
  keywords: "decorative acoustic interior finishing",
  answer: `
    <strong>Decorative and acoustic treatments</strong> improve aesthetics and sound quality indoors.
    <br><br>
    <strong>Examples:</strong>
    <ul>
      <li>False ceilings with acoustic panels</li>
      <li>Wall cladding with soundproof materials</li>
      <li>Decorative moldings and trims</li>
      <li>Fabric panels and curtains</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Noise reduction, modern design, comfort.
    <br><br>
  `
},
{
  question: "इंटीरियर में सजावटी और ध्वनिक उपचार क्या हैं?",
  keywords: "इंटीरियर सजावटी ध्वनिक फिनिशिंग",
  answer: `
    <strong>सजावटी और ध्वनिक उपचार</strong> अंदरूनी सौंदर्य और ध्वनि गुणवत्ता को बेहतर बनाते हैं।
    <br><br>
    <strong>उदाहरण:</strong>
    <ul>
      <li>फॉल्स सीलिंग में ध्वनिक पैनल</li>
      <li>साउंडप्रूफ सामग्री से वॉल क्लैडिंग</li>
      <li>सजावटी मोल्डिंग और ट्रिम</li>
      <li>फैब्रिक पैनल और परदे</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> शोर कम करना, आधुनिक डिज़ाइन, आराम।
    <br><br>
    <img src="https://example.com/acoustic-work.jpg" alt="Acoustic Work Image" />
  `
},
// -------------------- MODULAR KITCHEN WORK --------------------
{
  question: "what is modular kitchen work in construction?",
  keywords: "modular kitchen construction cabinets countertops fittings",
  answer: `
    <strong>Modular kitchen work</strong> involves prefabricated units for efficient and aesthetic cooking spaces.
    <br><br>
    <strong>Components:</strong>
    <ul>
      <li>Cabinets – base units, wall units, tall units</li>
      <li>Countertops – granite, quartz, marble</li>
      <li>Storage solutions – drawers, shelves, pull-outs</li>
      <li>Appliances – chimney, hob, oven, refrigerator</li>
      <li>Lighting – task and ambient</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Layout design – L-shape, U-shape, parallel</li>
      <li>Cabinet installation – prefabricated modules</li>
      <li>Countertop fixing – stone or engineered surfaces</li>
      <li>Appliance integration – electrical and plumbing connections</li>
      <li>Finishing – laminates, polish, lighting</li>
    </ul>
    
  `
},
{
  question: "निर्माण में मॉड्यूलर किचन कार्य क्या है?",
  keywords: "निर्माण मॉड्यूलर किचन कैबिनेट्स काउंटरटॉप फिटिंग्स",
  answer: `
    <strong>मॉड्यूलर किचन कार्य</strong> प्रीफैब्रिकेटेड यूनिट्स से कुशल और आकर्षक कुकिंग स्पेस तैयार करता है।
    <br><br>
    <strong>घटक:</strong>
    <ul>
      <li>कैबिनेट्स – बेस यूनिट, वॉल यूनिट, टॉल यूनिट</li>
      <li>काउंटरटॉप – ग्रेनाइट, क्वार्ट्ज, संगमरमर</li>
      <li>स्टोरेज समाधान – दराज, शेल्फ, पुल-आउट</li>
      <li>उपकरण – चिमनी, हॉब, ओवन, रेफ्रिजरेटर</li>
      <li>लाइटिंग – टास्क और एंबियंट</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>लेआउट डिज़ाइन – L-शेप, U-शेप, पैरेलल</li>
      <li>कैबिनेट इंस्टॉलेशन – प्रीफैब्रिकेटेड मॉड्यूल</li>
      <li>काउंटरटॉप लगाना – पत्थर या इंजीनियर्ड सतह</li>
      <li>उपकरण इंटीग्रेशन – इलेक्ट्रिकल और प्लंबिंग कनेक्शन</li>
      <li>फिनिशिंग – लैमिनेट, पॉलिश, लाइटिंग</li>
    </ul>
    
  `
},

// -------------------- BATHROOM WORK --------------------
{
  question: "what is bathroom finishing work in construction?",
  keywords: "bathroom work construction sanitary fittings tiling waterproofing",
  answer: `
    <strong>Bathroom finishing work</strong> ensures functionality, hygiene, and aesthetics in wet areas.
    <br><br>
    <strong>Components:</strong>
    <ul>
      <li>Sanitary fittings – WC, washbasin, shower, bathtub</li>
      <li>Plumbing – concealed pipes, hot & cold water lines</li>
      <li>Tiling – ceramic, vitrified, anti-skid tiles</li>
      <li>Waterproofing – membranes, chemical coatings</li>
      <li>Accessories – mirrors, towel racks, cabinets</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Plumbing layout and pipe installation</li>
      <li>Waterproofing treatment</li>
      <li>Tiling and joint grouting</li>
      <li>Sanitary fitting installation</li>
      <li>Finishing – mirrors, cabinets, lighting</li>
    </ul>
    
  `
},
{
  question: "निर्माण में बाथरूम फिनिशिंग कार्य क्या है?",
  keywords: "निर्माण बाथरूम कार्य सैनिटरी फिटिंग्स टाइलिंग वाटरप्रूफिंग",
  answer: `
    <strong>बाथरूम फिनिशिंग कार्य</strong> गीले क्षेत्रों में कार्यक्षमता, स्वच्छता और सौंदर्य सुनिश्चित करता है।
    <br><br>
    <strong>घटक:</strong>
    <ul>
      <li>सैनिटरी फिटिंग्स – WC, वॉशबेसिन, शॉवर, बाथटब</li>
      <li>प्लंबिंग – कंसील्ड पाइप, गर्म और ठंडे पानी की लाइनें</li>
      <li>टाइलिंग – सिरेमिक, विट्रिफाइड, एंटी-स्किड टाइलें</li>
      <li>वाटरप्रूफिंग – मेम्ब्रेन, केमिकल कोटिंग</li>
      <li>एक्सेसरीज़ – शीशे, तौलिया रैक, कैबिनेट</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>प्लंबिंग लेआउट और पाइप इंस्टॉलेशन</li>
      <li>वाटरप्रूफिंग ट्रीटमेंट</li>
      <li>टाइलिंग और जोड़ ग्राउटिंग</li>
      <li>सैनिटरी फिटिंग इंस्टॉलेशन</li>
      <li>फिनिशिंग – शीशे, कैबिनेट, लाइटिंग</li>
    </ul>
    
  `
},
// -------------------- SMART HOME AUTOMATION --------------------
{
  question: "what is smart home automation in construction?",
  keywords: "smart home automation IoT lighting security energy",
  answer: `
    <strong>Smart home automation</strong> integrates IoT devices and systems for convenience, security, and energy efficiency.
    <br><br>
    <strong>Components:</strong>
    <ul>
      <li>Lighting automation – smart bulbs, dimmers, motion sensors</li>
      <li>Security systems – CCTV, smart locks, alarms</li>
      <li>Climate control – smart thermostats, HVAC integration</li>
      <li>Energy management – smart meters, solar integration</li>
      <li>Voice & app control – Alexa, Google Home, mobile apps</li>
    </ul>
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>System design – identify devices and connectivity</li>
      <li>Installation – wiring, sensors, controllers</li>
      <li>Integration – connect to Wi-Fi and apps</li>
      <li>Testing – automation routines and safety checks</li>
    </ul>
    
  `
},
{
  question: "निर्माण में स्मार्ट होम ऑटोमेशन क्या है?",
  keywords: "निर्माण स्मार्ट होम ऑटोमेशन IoT लाइटिंग सुरक्षा ऊर्जा",
  answer: `
    <strong>स्मार्ट होम ऑटोमेशन</strong> IoT उपकरणों और सिस्टम को एकीकृत करता है ताकि सुविधा, सुरक्षा और ऊर्जा दक्षता मिले।
    <br><br>
    <strong>घटक:</strong>
    <ul>
      <li>लाइटिंग ऑटोमेशन – स्मार्ट बल्ब, डिमर, मोशन सेंसर</li>
      <li>सुरक्षा सिस्टम – CCTV, स्मार्ट लॉक, अलार्म</li>
      <li>क्लाइमेट कंट्रोल – स्मार्ट थर्मोस्टैट, HVAC इंटीग्रेशन</li>
      <li>ऊर्जा प्रबंधन – स्मार्ट मीटर, सोलर इंटीग्रेशन</li>
      <li>वॉइस और ऐप कंट्रोल – Alexa, Google Home, मोबाइल ऐप</li>
    </ul>
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>सिस्टम डिज़ाइन – उपकरण और कनेक्टिविटी पहचानना</li>
      <li>इंस्टॉलेशन – वायरिंग, सेंसर, कंट्रोलर</li>
      <li>इंटीग्रेशन – Wi-Fi और ऐप से जोड़ना</li>
      <li>टेस्टिंग – ऑटोमेशन रूटीन और सुरक्षा जांच</li>
    </ul>
    
  `
},

// -------------------- SMART SECURITY SYSTEMS --------------------
{
  question: "what are smart security systems in buildings?",
  keywords: "smart security systems construction CCTV alarms locks",
  answer: `
    <strong>Smart security systems</strong> protect buildings using connected devices and automation.
    <br><br>
    <strong>Components:</strong>
    <ul>
      <li>CCTV cameras – remote monitoring</li>
      <li>Smart locks – biometric or app-controlled</li>
      <li>Intrusion alarms – motion and door sensors</li>
      <li>Video door phones – visitor identification</li>
      <li>Integration – mobile apps and cloud storage</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Enhanced safety, remote access, real-time alerts.
    
  `
},
{
  question: "भवनों में स्मार्ट सुरक्षा सिस्टम क्या हैं?",
  keywords: "भवन स्मार्ट सुरक्षा सिस्टम CCTV अलार्म लॉक",
  answer: `
    <strong>स्मार्ट सुरक्षा सिस्टम</strong> जुड़े हुए उपकरणों और ऑटोमेशन से भवनों की सुरक्षा करते हैं।
    <br><br>
    <strong>घटक:</strong>
    <ul>
      <li>CCTV कैमरे – रिमोट मॉनिटरिंग</li>
      <li>स्मार्ट लॉक – बायोमेट्रिक या ऐप-नियंत्रित</li>
      <li>इंट्रूज़न अलार्म – मोशन और दरवाज़ा सेंसर</li>
      <li>वीडियो डोर फोन – आगंतुक पहचान</li>
      <li>इंटीग्रेशन – मोबाइल ऐप और क्लाउड स्टोरेज</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> बेहतर सुरक्षा, रिमोट एक्सेस, रियल-टाइम अलर्ट।
    
  `
},
// -------------------- SOLAR ENERGY SYSTEMS --------------------
{
  question: "what is the role of solar energy in green buildings?",
  keywords: "green building solar panels renewable energy",
  answer: `
    <strong>Solar energy systems</strong> provide renewable power for buildings, reducing dependency on fossil fuels.
    <br><br>
    <strong>Components:</strong>
    <ul>
      <li>Solar panels – photovoltaic modules</li>
      <li>Inverters – convert DC to AC</li>
      <li>Battery storage – backup power</li>
      <li>Grid connection – net metering</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Clean energy, reduced electricity bills, sustainability.
   
  `
},
{
  question: "ग्रीन बिल्डिंग में सोलर एनर्जी की भूमिका क्या है?",
  keywords: "ग्रीन बिल्डिंग सोलर पैनल नवीकरणीय ऊर्जा",
  answer: `
    <strong>सोलर एनर्जी सिस्टम</strong> भवनों को नवीकरणीय ऊर्जा प्रदान करते हैं और जीवाश्म ईंधन पर निर्भरता कम करते हैं।
    <br><br>
    <strong>घटक:</strong>
    <ul>
      <li>सोलर पैनल – फोटोवोल्टिक मॉड्यूल</li>
      <li>इन्वर्टर – DC को AC में बदलना</li>
      <li>बैटरी स्टोरेज – बैकअप पावर</li>
      <li>ग्रिड कनेक्शन – नेट मीटरिंग</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> स्वच्छ ऊर्जा, बिजली बिल में कमी, स्थिरता।
    
  `
},

// -------------------- RAINWATER HARVESTING --------------------
{
  question: "what is rainwater harvesting in construction?",
  keywords: "rainwater harvesting green building water conservation",
  answer: `
    <strong>Rainwater harvesting</strong> collects and stores rainwater for reuse in buildings.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Collection – rooftop catchment</li>
      <li>Filtration – remove debris</li>
      <li>Storage – tanks or underground reservoirs</li>
      <li>Distribution – reuse for flushing, irrigation</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Water conservation, reduced dependency on municipal supply, sustainability.
    
  `
},
{
  question: "निर्माण में वर्षा जल संचयन क्या है?",
  keywords: "निर्माण वर्षा जल संचयन ग्रीन बिल्डिंग जल संरक्षण",
  answer: `
    <strong>वर्षा जल संचयन</strong> भवनों में वर्षा जल को एकत्रित और संग्रहित करके पुन: उपयोग करता है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>संग्रहण – छत से पानी पकड़ना</li>
      <li>फिल्ट्रेशन – मलबा हटाना</li>
      <li>भंडारण – टैंक या भूमिगत जलाशय</li>
      <li>वितरण – फ्लशिंग, सिंचाई में उपयोग</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> जल संरक्षण, नगरपालिका आपूर्ति पर निर्भरता कम करना, स्थिरता।
    
  `
},

// -------------------- ENERGY-EFFICIENT MATERIALS --------------------
{
  question: "what are energy-efficient materials in green construction?",
  keywords: "energy efficient materials green building insulation",
  answer: `
    <strong>Energy-efficient materials</strong> reduce energy consumption and improve building performance.
    <br><br>
    <strong>Examples:</strong>
    <ul>
      <li>Insulated concrete blocks</li>
      <li>Low-E glass windows</li>
      <li>Recycled steel and timber</li>
      <li>Cool roofing materials</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Lower energy bills, thermal comfort, eco-friendly construction.
    
    
  `
},
{
  question: "ग्रीन निर्माण में ऊर्जा-कुशल सामग्री क्या हैं?",
  keywords: "ग्रीन निर्माण ऊर्जा-कुशल सामग्री इंसुलेशन",
  answer: `
    <strong>ऊर्जा-कुशल सामग्री</strong> ऊर्जा खपत कम करती हैं और भवन प्रदर्शन को बेहतर बनाती हैं।
    <br><br>
    <strong>उदाहरण:</strong>
    <ul>
      <li>इंसुलेटेड कंक्रीट ब्लॉक</li>
      <li>लो-ई ग्लास खिड़कियाँ</li>
      <li>रीसाइकल स्टील और लकड़ी</li>
      <li>कूल रूफिंग सामग्री</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> कम बिजली बिल, थर्मल आराम, पर्यावरण-अनुकूल निर्माण।
    
  `
},

// -------------------- WASTE MANAGEMENT --------------------
{
  question: "what is waste management in sustainable construction?",
  keywords: "waste management green building recycling",
  answer: `
    <strong>Waste management</strong> ensures proper disposal and recycling of construction and household waste.
    <br><br>
    <strong>Process:</strong>
    <ul>
      <li>Segregation – biodegradable, recyclable, hazardous waste</li>
      <li>Recycling – reuse of steel, timber, concrete</li>
      <li>Composting – organic waste treatment</li>
      <li>Safe disposal – hazardous materials</li>
    </ul>
    <br><br>
    <strong>Benefits:</strong> Reduced pollution, resource conservation, eco-friendly environment.
    
  `
},
{
  question: "सस्टेनेबल निर्माण में वेस्ट मैनेजमेंट क्या है?",
  keywords: "सस्टेनेबल निर्माण वेस्ट मैनेजमेंट रीसाइक्लिंग",
  answer: `
    <strong>वेस्ट मैनेजमेंट</strong> निर्माण और घरेलू अपशिष्ट के उचित निपटान और रीसाइक्लिंग को सुनिश्चित करता है।
    <br><br>
    <strong>प्रक्रिया:</strong>
    <ul>
      <li>विभाजन – बायोडिग्रेडेबल, रीसाइक्लेबल, खतरनाक अपशिष्ट</li>
      <li>रीसाइक्लिंग – स्टील, लकड़ी, कंक्रीट का पुन: उपयोग</li>
      <li>कम्पोस्टिंग – जैविक अपशिष्ट का उपचार</li>
      <li>सुरक्षित निपटान – खतरनाक सामग्री</li>
    </ul>
    <br><br>
    <strong>लाभ:</strong> प्रदूषण कम करना, संसाधन संरक्षण, पर्यावरण-अनुकूल वातावरण।
    
  `
},
// -------------------- PROJECT MANAGEMENT --------------------
{
  question: "what is project management in construction?",
  keywords: "project management construction scheduling cost control safety",
  answer: `
    <strong>Project management</strong> ensures timely, cost-effective, and quality delivery of construction projects.
    <br><br>
    <strong>Key Points (8):</strong>
    <ol>
      <li>Planning – define scope, objectives, resources</li>
      <li>Scheduling – prepare timelines and milestones</li>
      <li>Budgeting – cost estimation and control</li>
      <li>Resource allocation – manpower, materials, equipment</li>
      <li>Risk management – identify and mitigate risks</li>
      <li>Communication – coordination among stakeholders</li>
      <li>Monitoring – track progress and performance</li>
      <li>Closing – handover and documentation</li>
    </ol>
    
  `
},
{
  question: "निर्माण में प्रोजेक्ट मैनेजमेंट क्या है?",
  keywords: "निर्माण प्रोजेक्ट मैनेजमेंट शेड्यूलिंग लागत नियंत्रण सुरक्षा",
  answer: `
    <strong>प्रोजेक्ट मैनेजमेंट</strong> निर्माण परियोजनाओं को समय पर, लागत-प्रभावी और गुणवत्तापूर्ण तरीके से पूरा करता है।
    <br><br>
    <strong>मुख्य बिंदु (8):</strong>
    <ol>
      <li>योजना – स्कोप, उद्देश्य और संसाधन तय करना</li>
      <li>शेड्यूलिंग – टाइमलाइन और माइलस्टोन बनाना</li>
      <li>बजटिंग – लागत अनुमान और नियंत्रण</li>
      <li>संसाधन आवंटन – जनशक्ति, सामग्री, उपकरण</li>
      <li>जोखिम प्रबंधन – जोखिम पहचान और समाधान</li>
      <li>संचार – हितधारकों के बीच समन्वय</li>
      <li>निगरानी – प्रगति और प्रदर्शन ट्रैक करना</li>
      <li>समापन – हैंडओवर और डॉक्यूमेंटेशन</li>
    </ol>
    
  `
},

// -------------------- QUALITY CONTROL --------------------
{
  question: "what is quality control in construction?",
  keywords: "quality control construction material testing safety audits",
  answer: `
    <strong>Quality control</strong> ensures construction meets standards, specifications, and safety requirements.
    <br><br>
    <strong>Key Points (8):</strong>
    <ol>
      <li>Material testing – cement, steel, aggregates</li>
      <li>Workmanship inspection – finishing and accuracy</li>
      <li>Safety audits – compliance with safety norms</li>
      <li>Site supervision – daily monitoring</li>
      <li>Documentation – records of tests and approvals</li>
      <li>Standard compliance – IS codes, building regulations</li>
      <li>Defect rectification – identify and correct issues</li>
      <li>Final inspection – approval before handover</li>
    </ol>
    
  `
},
{
  question: "निर्माण में क्वालिटी कंट्रोल क्या है?",
  keywords: "निर्माण क्वालिटी कंट्रोल सामग्री परीक्षण सुरक्षा ऑडिट",
  answer: `
    <strong>क्वालिटी कंट्रोल</strong> सुनिश्चित करता है कि निर्माण मानकों, विनिर्देशों और सुरक्षा आवश्यकताओं को पूरा करे।
    <br><br>
    <strong>मुख्य बिंदु (8):</strong>
    <ol>
      <li>सामग्री परीक्षण – सीमेंट, स्टील, एग्रीगेट्स</li>
      <li>वर्कमैनशिप निरीक्षण – फिनिशिंग और सटीकता</li>
      <li>सुरक्षा ऑडिट – सुरक्षा मानकों का पालन</li>
      <li>साइट सुपरविजन – दैनिक निगरानी</li>
      <li>डॉक्यूमेंटेशन – परीक्षण और अनुमोदन का रिकॉर्ड</li>
      <li>मानक अनुपालन – IS कोड, बिल्डिंग रेगुलेशन</li>
      <li>दोष सुधार – समस्याओं की पहचान और समाधान</li>
      <li>अंतिम निरीक्षण – हैंडओवर से पहले अनुमोदन</li>
    </ol>
    
  `
},
// -------------------- CONSTRUCTION DOCUMENTATION --------------------
{
  question: "what is construction documentation?",
  keywords: "construction documentation drawings BOQ site records",
  answer: `
    <strong>Construction documentation</strong> refers to all records, drawings, and reports used to plan and execute projects.
    <br><br>
    <strong>Key Points (8):</strong>
    <ol>
      <li>Architectural drawings – plans, elevations, sections</li>
      <li>Structural drawings – reinforcement and load details</li>
      <li>MEP drawings – mechanical, electrical, plumbing layouts</li>
      <li>BOQ (Bill of Quantities) – material and cost estimates</li>
      <li>Specifications – standards and quality requirements</li>
      <li>Site records – daily logs, progress reports</li>
      <li>Inspection reports – quality and safety checks</li>
      <li>Completion certificates – final approvals</li>
    </ol>
    
  `
},
{
  question: "निर्माण दस्तावेज़ीकरण क्या है?",
  keywords: "निर्माण दस्तावेज़ीकरण ड्रॉइंग्स BOQ साइट रिकॉर्ड",
  answer: `
    <strong>निर्माण दस्तावेज़ीकरण</strong> उन सभी रिकॉर्ड, ड्रॉइंग और रिपोर्ट को कहते हैं जो परियोजनाओं की योजना और निष्पादन में उपयोग होते हैं।
    <br><br>
    <strong>मुख्य बिंदु (8):</strong>
    <ol>
      <li>आर्किटेक्चरल ड्रॉइंग – प्लान, एलिवेशन, सेक्शन</li>
      <li>स्ट्रक्चरल ड्रॉइंग – रिइनफोर्समेंट और लोड विवरण</li>
      <li>MEP ड्रॉइंग – मैकेनिकल, इलेक्ट्रिकल, प्लंबिंग लेआउट</li>
      <li>BOQ (बिल ऑफ क्वांटिटी) – सामग्री और लागत अनुमान</li>
      <li>स्पेसिफिकेशन – मानक और गुणवत्ता आवश्यकताएँ</li>
      <li>साइट रिकॉर्ड – दैनिक लॉग, प्रगति रिपोर्ट</li>
      <li>निरीक्षण रिपोर्ट – गुणवत्ता और सुरक्षा जांच</li>
      <li>कम्प्लीशन सर्टिफिकेट – अंतिम अनुमोदन</li>
    </ol>
   
  `
},

// -------------------- CONSTRUCTION CONTRACTS --------------------
{
  question: "what are construction contracts?",
  keywords: "construction contracts agreements tender documents",
  answer: `
    <strong>Construction contracts</strong> are legally binding agreements between client and contractor for project execution.
    <br><br>
    <strong>Key Points (8):</strong>
    <ol>
      <li>Tender documents – invitation and bidding process</li>
      <li>Agreement – signed contract between parties</li>
      <li>Scope of work – detailed description of tasks</li>
      <li>Payment terms – schedule and mode of payments</li>
      <li>Time schedule – deadlines and milestones</li>
      <li>Quality clauses – compliance with standards</li>
      <li>Penalty clauses – delay or defect liabilities</li>
      <li>Dispute resolution – arbitration or legal remedies</li>
    </ol>
   
  `
},
{
  question: "निर्माण अनुबंध क्या हैं?",
  keywords: "निर्माण अनुबंध एग्रीमेंट टेंडर दस्तावेज़",
  answer: `
    <strong>निर्माण अनुबंध</strong> क्लाइंट और कॉन्ट्रैक्टर के बीच परियोजना निष्पादन के लिए कानूनी समझौते होते हैं।
    <br><br>
    <strong>मुख्य बिंदु (8):</strong>
    <ol>
      <li>टेंडर दस्तावेज़ – आमंत्रण और बोली प्रक्रिया</li>
      <li>एग्रीमेंट – पक्षों के बीच हस्ताक्षरित अनुबंध</li>
      <li>कार्य का दायरा – कार्यों का विस्तृत विवरण</li>
      <li>भुगतान शर्तें – भुगतान का शेड्यूल और तरीका</li>
      <li>समय शेड्यूल – डेडलाइन और माइलस्टोन</li>
      <li>गुणवत्ता क्लॉज़ – मानकों का अनुपालन</li>
      <li>दंड क्लॉज़ – देरी या दोष की जिम्मेदारी</li>
      <li>विवाद समाधान – मध्यस्थता या कानूनी उपाय</li>
    </ol>
    
  `
},
// -------------------- SITE MANAGEMENT --------------------
{
  question: "what is site management in construction?",
  keywords: "site management construction daily logs manpower safety",
  answer: `
    <strong>Site management</strong> ensures smooth execution of construction activities on-site.
    <br><br>
    <strong>Key Points (8):</strong>
    <ol>
      <li>Daily logs – record work progress and issues</li>
      <li>Manpower control – allocate and monitor workforce</li>
      <li>Material management – track supply and usage</li>
      <li>Equipment management – ensure availability and maintenance</li>
      <li>Safety monitoring – enforce safety rules</li>
      <li>Coordination – between contractors, engineers, and workers</li>
      <li>Time management – meet deadlines and schedules</li>
      <li>Reporting – communicate updates to project managers</li>
    </ol>

  `
},
{
  question: "निर्माण में साइट मैनेजमेंट क्या है?",
  keywords: "निर्माण साइट मैनेजमेंट दैनिक लॉग जनशक्ति सुरक्षा",
  answer: `
    <strong>साइट मैनेजमेंट</strong> निर्माण गतिविधियों के सुचारू निष्पादन को सुनिश्चित करता है।
    <br><br>
    <strong>मुख्य बिंदु (8):</strong>
    <ol>
      <li>दैनिक लॉग – कार्य प्रगति और समस्याओं का रिकॉर्ड</li>
      <li>जनशक्ति नियंत्रण – कार्यबल का आवंटन और निगरानी</li>
      <li>सामग्री प्रबंधन – आपूर्ति और उपयोग की निगरानी</li>
      <li>उपकरण प्रबंधन – उपलब्धता और रखरखाव सुनिश्चित करना</li>
      <li>सुरक्षा निगरानी – सुरक्षा नियमों का पालन</li>
      <li>समन्वय – कॉन्ट्रैक्टर, इंजीनियर और मजदूरों के बीच</li>
      <li>समय प्रबंधन – डेडलाइन और शेड्यूल पूरा करना</li>
      <li>रिपोर्टिंग – प्रोजेक्ट मैनेजर को अपडेट देना</li>
    </ol>

  `
},

// -------------------- SITE SUPERVISION --------------------
{
  question: "what is site supervision in construction?",
  keywords: "site supervision construction monitoring safety quality",
  answer: `
    <strong>Site supervision</strong> involves overseeing daily construction activities to ensure quality and safety.
    <br><br>
    <strong>Key Points (8):</strong>
    <ol>
      <li>Work monitoring – check progress against schedule</li>
      <li>Quality inspection – ensure standards are met</li>
      <li>Safety enforcement – PPE and site rules</li>
      <li>Problem solving – address on-site challenges</li>
      <li>Communication – link between workers and management</li>
      <li>Documentation – maintain inspection and test records</li>
      <li>Training – guide workers on procedures</li>
      <li>Final approval – certify completed works</li>
    </ol>
    
  `
},
{
  question: "निर्माण में साइट सुपरविजन क्या है?",
  keywords: "निर्माण साइट सुपरविजन निगरानी सुरक्षा गुणवत्ता",
  answer: `
    <strong>साइट सुपरविजन</strong> दैनिक निर्माण गतिविधियों की निगरानी करता है ताकि गुणवत्ता और सुरक्षा सुनिश्चित हो सके।
    <br><br>
    <strong>मुख्य बिंदु (8):</strong>
    <ol>
      <li>कार्य निगरानी – शेड्यूल के अनुसार प्रगति जांचना</li>
      <li>गुणवत्ता निरीक्षण – मानकों का पालन सुनिश्चित करना</li>
      <li>सुरक्षा प्रवर्तन – PPE और साइट नियम</li>
      <li>समस्या समाधान – साइट पर चुनौतियों का निपटान</li>
      <li>संचार – मजदूरों और प्रबंधन के बीच लिंक</li>
      <li>डॉक्यूमेंटेशन – निरीक्षण और परीक्षण रिकॉर्ड बनाए रखना</li>
      <li>प्रशिक्षण – मजदूरों को प्रक्रियाओं पर मार्गदर्शन देना</li>
      <li>अंतिम अनुमोदन – पूर्ण कार्यों को प्रमाणित करना</li>
    </ol>
    
  `
},
// -------------------- CONSTRUCTION SAFETY & HEALTH PRACTICES --------------------
{
  question: "what are construction safety and health practices?",
  keywords: "construction safety health practices PPE audits emergency response",
  answer: `
    <strong>Construction safety & health practices</strong> protect workers and ensure safe project execution.
    <br><br>
    <strong>Key Points (10):</strong>
    <ol>
      <li>PPE (Personal Protective Equipment) – helmets, gloves, boots, masks</li>
      <li>Safety training – induction and regular awareness sessions</li>
      <li>Site safety audits – periodic inspections</li>
      <li>Emergency response – fire drills, first aid, evacuation plans</li>
      <li>Hazard identification – risk assessment and mitigation</li>
      <li>Safe scaffolding & ladders – proper installation and use</li>
      <li>Electrical safety – insulated wiring, lockout/tagout procedures</li>
      <li>Health monitoring – medical check-ups and hygiene facilities</li>
      <li>Worker welfare – clean drinking water, rest areas, sanitation</li>
      <li>Documentation – safety records, incident reports, compliance certificates</li>
    </ol>
    
  `
},
{
  question: "निर्माण में सुरक्षा और स्वास्थ्य प्रथाएँ क्या हैं?",
  keywords: "निर्माण सुरक्षा स्वास्थ्य PPE ऑडिट आपातकालीन प्रतिक्रिया",
  answer: `
    <strong>निर्माण सुरक्षा और स्वास्थ्य प्रथाएँ</strong> मजदूरों की रक्षा करती हैं और सुरक्षित परियोजना निष्पादन सुनिश्चित करती हैं।
    <br><br>
    <strong>मुख्य बिंदु (10):</strong>
    <ol>
      <li>PPE (पर्सनल प्रोटेक्टिव इक्विपमेंट) – हेलमेट, दस्ताने, बूट, मास्क</li>
      <li>सुरक्षा प्रशिक्षण – इंडक्शन और नियमित जागरूकता सत्र</li>
      <li>साइट सुरक्षा ऑडिट – समय-समय पर निरीक्षण</li>
      <li>आपातकालीन प्रतिक्रिया – फायर ड्रिल, फर्स्ट एड, निकासी योजना</li>
      <li>खतरे की पहचान – जोखिम मूल्यांकन और समाधान</li>
      <li>सुरक्षित मचान और सीढ़ियाँ – सही इंस्टॉलेशन और उपयोग</li>
      <li>इलेक्ट्रिकल सुरक्षा – इंसुलेटेड वायरिंग, लॉकआउट/टैगआउट प्रक्रियाएँ</li>
      <li>स्वास्थ्य निगरानी – मेडिकल चेकअप और स्वच्छता सुविधाएँ</li>
      <li>मजदूर कल्याण – स्वच्छ पेयजल, विश्राम क्षेत्र, शौचालय</li>
      <li>डॉक्यूमेंटेशन – सुरक्षा रिकॉर्ड, घटना रिपोर्ट, अनुपालन प्रमाणपत्र</li>
    </ol>
   
  `
},
// -------------------- BIM (Building Information Modeling) --------------------
{
  question: "what is BIM in construction technology?",
  keywords: "BIM construction technology building information modeling",
  answer: `
    <strong>BIM (Building Information Modeling)</strong> is a digital representation of physical and functional aspects of a building.
    <br><br>
    <strong>Key Innovations:</strong>
    <ul>
      <li>3D modeling – visualize design before construction</li>
      <li>Collaboration – architects, engineers, contractors work on one platform</li>
      <li>Cost estimation – accurate BOQ and budgeting</li>
      <li>Clash detection – identify conflicts in design</li>
      <li>Lifecycle management – from design to demolition</li>
    </ul>
   
  `
},
{
  question: "निर्माण तकनीक में BIM क्या है?",
  keywords: "निर्माण तकनीक BIM बिल्डिंग इंफॉर्मेशन मॉडलिंग",
  answer: `
    <strong>BIM (बिल्डिंग इंफॉर्मेशन मॉडलिंग)</strong> भवन के भौतिक और कार्यात्मक पहलुओं का डिजिटल प्रतिनिधित्व है।
    <br><br>
    <strong>मुख्य नवाचार:</strong>
    <ul>
      <li>3D मॉडलिंग – निर्माण से पहले डिज़ाइन देखना</li>
      <li>सहयोग – आर्किटेक्ट, इंजीनियर, कॉन्ट्रैक्टर एक प्लेटफ़ॉर्म पर काम करते हैं</li>
      <li>लागत अनुमान – सटीक BOQ और बजटिंग</li>
      <li>क्लैश डिटेक्शन – डिज़ाइन में टकराव पहचानना</li>
      <li>लाइफसाइकल मैनेजमेंट – डिज़ाइन से डिमोलिशन तक</li>
    </ul>
    
  `
},

// -------------------- DRONES --------------------
{
  question: "how are drones used in construction?",
  keywords: "drones construction technology site survey monitoring",
  answer: `
    <strong>Drones</strong> are used for aerial surveys, monitoring, and safety checks in construction.
    <br><br>
    <strong>Applications:</strong>
    <ul>
      <li>Site surveys – mapping and topography</li>
      <li>Progress monitoring – real-time aerial updates</li>
      <li>Safety inspections – hard-to-reach areas</li>
      <li>Material tracking – logistics and inventory</li>
      <li>Marketing – aerial photography and videos</li>
    </ul>
    <br><br>
    
  `
},
{
  question: "निर्माण में ड्रोन का उपयोग कैसे होता है?",
  keywords: "निर्माण ड्रोन तकनीक साइट सर्वे निगरानी",
  answer: `
    <strong>ड्रोन</strong> निर्माण में हवाई सर्वे, निगरानी और सुरक्षा जांच के लिए उपयोग किए जाते हैं।
    <br><br>
    <strong>उपयोग:</strong>
    <ul>
      <li>साइट सर्वे – मैपिंग और टोपोग्राफी</li>
      <li>प्रगति निगरानी – रियल-टाइम हवाई अपडेट</li>
      <li>सुरक्षा निरीक्षण – कठिन स्थानों की जांच</li>
      <li>सामग्री ट्रैकिंग – लॉजिस्टिक्स और इन्वेंटरी</li>
      <li>मार्केटिंग – हवाई फोटोग्राफी और वीडियो</li>
    </ul>
    
  `
},

// -------------------- ROBOTICS --------------------
{
  question: "what is the role of robotics in construction?",
  keywords: "robotics construction technology automation",
  answer: `
    <strong>Robotics</strong> automate repetitive and hazardous tasks in construction.
    <br><br>
    <strong>Applications:</strong>
    <ul>
      <li>Bricklaying robots – faster masonry</li>
      <li>Concrete printing – automated pouring</li>
      <li>Demolition robots – safe dismantling</li>
      <li>Inspection robots – tunnels and pipelines</li>
      <li>Safety robots – monitor hazardous zones</li>
    </ul>
    
  `
},
{
  question: "निर्माण में रोबोटिक्स की भूमिका क्या है?",
  keywords: "निर्माण रोबोटिक्स तकनीक ऑटोमेशन",
  answer: `
    <strong>रोबोटिक्स</strong> निर्माण में दोहराए जाने वाले और खतरनाक कार्यों को स्वचालित करते हैं।
    <br><br>
    <strong>उपयोग:</strong>
    <ul>
      <li>ब्रिकलेइंग रोबोट – तेज़ मिस्त्री कार्य</li>
      <li>कंक्रीट प्रिंटिंग – स्वचालित डालना</li>
      <li>डिमोलिशन रोबोट – सुरक्षित विघटन</li>
      <li>इंस्पेक्शन रोबोट – सुरंग और पाइपलाइन</li>
      <li>सुरक्षा रोबोट – खतरनाक क्षेत्रों की निगरानी</li>
    </ul>
   
  `
},

// -------------------- 3D PRINTING --------------------
{
  question: "what is 3D printing in construction?",
  keywords: "3D printing construction technology concrete houses",
  answer: `
    <strong>3D printing</strong> builds structures layer by layer using automated machines.
    <br><br>
    <strong>Applications:</strong>
    <ul>
      <li>Concrete houses – rapid affordable housing</li>
      <li>Complex designs – customized architecture</li>
      <li>Prefabricated components – walls, slabs</li>
      <li>Reduced waste – precise material usage</li>
      <li>Speed – faster than traditional methods</li>
    </ul>
    
  `
},
{
  question: "निर्माण में 3D प्रिंटिंग क्या है?",
  keywords: "निर्माण 3D प्रिंटिंग तकनीक कंक्रीट घर",
  answer: `
    <strong>3D प्रिंटिंग</strong> स्वचालित मशीनों द्वारा परत दर परत संरचनाएँ बनाता है।
    <br><br>
    <strong>उपयोग:</strong>
    <ul>
      <li>कंक्रीट घर – तेज़ और सस्ती आवास</li>
      <li>जटिल डिज़ाइन – कस्टम आर्किटेक्चर</li>
      <li>प्रीफैब्रिकेटेड कंपोनेंट – दीवारें, स्लैब</li>
      <li>अपशिष्ट कम करना – सटीक सामग्री उपयोग</li>
      <li>गति – पारंपरिक तरीकों से तेज़</li>
    </ul>
    
  `
},

// -------------------- AI TOOLS --------------------
{
  question: "how is AI used in construction?",
  keywords: "AI tools construction technology predictive analytics automation",
  answer: `
    <strong>AI tools</strong> optimize construction processes with predictive analytics and automation.
    <br><br>
    <strong>Applications:</strong>
    <ul>
      <li>Predictive maintenance – equipment health monitoring</li>
      <li>Project scheduling – AI-driven optimization</li>
      <li>Safety monitoring – detect risks via cameras</li>
      <li>Design optimization – AI-assisted architecture</li>
      <li>Cost control – data-driven budgeting</li>
    </ul>
    
  `
},
{
  question: "निर्माण में AI का उपयोग कैसे होता है?",
  keywords: "निर्माण AI उपकरण तकनीक प्रेडिक्टिव एनालिटिक्स ऑटोमेशन",
  answer: `
    <strong>AI उपकरण</strong> प्रेडिक्टिव एनालिटिक्स और ऑटोमेशन से निर्माण प्रक्रियाओं को अनुकूलित करते हैं।
    <br><br>
    <strong>उपयोग:</strong>
    <ul>
      <li>प्रेडिक्टिव मेंटेनेंस – उपकरण स्वास्थ्य निगरानी</li>
      <li>प्रोजेक्ट शेड्यूलिंग – AI आधारित अनुकूलन</li>
      <li>सुरक्षा निगरानी – कैमरों से जोखिम पहचान</li>
      <li>डिज़ाइन अनुकूलन – AI-सहायता प्राप्त आर्किटेक्चर</li>
      <li>लागत नियंत्रण – डेटा-आधारित बजटिंग</li>
    </ul>
    
  `
},
// -------------------- SMART MATERIALS --------------------
{
  question: "what are smart materials in future construction?",
  keywords: "smart materials construction self-healing carbon neutral",
  answer: `
    <strong>Smart materials</strong> are advanced building materials that adapt or respond to environmental conditions.
    <br><br>
    <strong>Examples:</strong>
    <ul>
      <li>Self-healing concrete – repairs cracks automatically</li>
      <li>Phase-change materials – regulate temperature</li>
      <li>Carbon-neutral cement – eco-friendly production</li>
      <li>Transparent solar glass – generates electricity</li>
    </ul>
    
  `
},
{
  question: "भविष्य के निर्माण में स्मार्ट सामग्री क्या हैं?",
  keywords: "भविष्य निर्माण स्मार्ट सामग्री सेल्फ-हीलिंग कार्बन न्यूट्रल",
  answer: `
    <strong>स्मार्ट सामग्री</strong> उन्नत निर्माण सामग्री हैं जो पर्यावरणीय परिस्थितियों के अनुसार प्रतिक्रिया करती हैं।
    <br><br>
    <strong>उदाहरण:</strong>
    <ul>
      <li>सेल्फ-हीलिंग कंक्रीट – दरारें स्वतः ठीक करता है</li>
      <li>फेज़-चेंज सामग्री – तापमान नियंत्रित करती है</li>
      <li>कार्बन-न्यूट्रल सीमेंट – पर्यावरण-अनुकूल उत्पादन</li>
      <li>ट्रांसपेरेंट सोलर ग्लास – बिजली उत्पन्न करता है</li>
    </ul>
    
  `
},

// -------------------- CARBON-NEUTRAL BUILDINGS --------------------
{
  question: "what are carbon-neutral buildings?",
  keywords: "carbon neutral buildings sustainable construction",
  answer: `
    <strong>Carbon-neutral buildings</strong> are designed to minimize or offset carbon emissions during their lifecycle.
    <br><br>
    <strong>Features:</strong>
    <ul>
      <li>Renewable energy integration – solar, wind</li>
      <li>Efficient insulation – reduce energy use</li>
      <li>Green roofs and walls – absorb CO2</li>
      <li>Carbon offset programs – balance emissions</li>
    </ul>
    
  `
},
{
  question: "कार्बन-न्यूट्रल भवन क्या हैं?",
  keywords: "कार्बन न्यूट्रल भवन सस्टेनेबल निर्माण",
  answer: `
    <strong>कार्बन-न्यूट्रल भवन</strong> ऐसे डिज़ाइन किए जाते हैं कि उनके जीवनचक्र में कार्बन उत्सर्जन न्यूनतम या संतुलित हो।
    <br><br>
    <strong>विशेषताएँ:</strong>
    <ul>
      <li>नवीकरणीय ऊर्जा इंटीग्रेशन – सोलर, विंड</li>
      <li>कुशल इंसुलेशन – ऊर्जा उपयोग कम करना</li>
      <li>ग्रीन रूफ और दीवारें – CO2 अवशोषित करना</li>
      <li>कार्बन ऑफसेट प्रोग्राम – उत्सर्जन संतुलित करना</li>
    </ul>
    
  `
},

// -------------------- DIGITAL TWINS --------------------
{
  question: "what are digital twins in construction?",
  keywords: "digital twins construction future technology",
  answer: `
    <strong>Digital twins</strong> are virtual replicas of physical buildings used for monitoring and optimization.
    <br><br>
    <strong>Applications:</strong>
    <ul>
      <li>Real-time monitoring – sensors feed live data</li>
      <li>Predictive maintenance – anticipate failures</li>
      <li>Energy optimization – reduce consumption</li>
      <li>Lifecycle management – design to demolition</li>
    </ul>
   
  `
},
{
  question: "निर्माण में डिजिटल ट्विन्स क्या हैं?",
  keywords: "निर्माण डिजिटल ट्विन्स भविष्य तकनीक",
  answer: `
    <strong>डिजिटल ट्विन्स</strong> भवनों की वर्चुअल प्रतिकृतियाँ होती हैं जिन्हें निगरानी और अनुकूलन के लिए उपयोग किया जाता है।
    <br><br>
    <strong>उपयोग:</strong>
    <ul>
      <li>रियल-टाइम निगरानी – सेंसर से लाइव डेटा</li>
      <li>प्रेडिक्टिव मेंटेनेंस – विफलताओं का पूर्वानुमान</li>
      <li>ऊर्जा अनुकूलन – खपत कम करना</li>
      <li>लाइफसाइकल मैनेजमेंट – डिज़ाइन से डिमोलिशन तक</li>
    </ul>
    
  `
},

// -------------------- MODULAR CONSTRUCTION --------------------
{
  question: "what is modular construction?",
  keywords: "modular construction prefabrication future trend",
  answer: `
    <strong>Modular construction</strong> uses prefabricated units assembled on-site for faster and efficient building.
    <br><br>
    <strong>Advantages:</strong>
    <ul>
      <li>Speed – faster than traditional methods</li>
      <li>Cost efficiency – reduced labor and waste</li>
      <li>Flexibility – easy expansion or relocation</li>
      <li>Sustainability – controlled factory production</li>
    </ul>

  `
},
{
  question: "मॉड्यूलर निर्माण क्या है?",
  keywords: "मॉड्यूलर निर्माण प्रीफैब्रिकेशन भविष्य प्रवृत्ति",
  answer: `
    <strong>मॉड्यूलर निर्माण</strong> प्रीफैब्रिकेटेड यूनिट्स का उपयोग करता है जिन्हें साइट पर असेंबल किया जाता है ताकि निर्माण तेज़ और कुशल हो।
    <br><br>
    <strong>लाभ:</strong>
    <ul>
      <li>गति – पारंपरिक तरीकों से तेज़</li>
      <li>लागत दक्षता – श्रम और अपशिष्ट कम करना</li>
      <li>लचीलापन – विस्तार या स्थानांतरण में आसानी</li>
      <li>स्थिरता – नियंत्रित फैक्ट्री उत्पादन</li>
    </ul>

  `
},

// -------------------- SUSTAINABLE URBAN PLANNING --------------------
{
  question: "what is sustainable urban planning in future construction?",
  keywords: "sustainable urban planning construction smart cities",
  answer: `
    <strong>Sustainable urban planning</strong> designs cities to balance growth with environmental and social needs.
    <br><br>
    <strong>Features:</strong>
    <ul>
      <li>Smart cities – IoT-based infrastructure</li>
      <li>Green transport – EVs, cycling tracks</li>
      <li>Public spaces – parks, community centers</li>
      <li>Resource efficiency – water, energy, waste management</li>
    </ul>
 
  `
},
{
  question: "भविष्य निर्माण में सस्टेनेबल अर्बन प्लानिंग क्या है?",
  keywords: "भविष्य निर्माण सस्टेनेबल अर्बन प्लानिंग स्मार्ट सिटी",
  answer: `
    <strong>सस्टेनेबल अर्बन प्लानिंग</strong> शहरों को इस तरह डिज़ाइन करती है कि विकास पर्यावरण और सामाजिक आवश्यकताओं के साथ संतुलित हो।
    <br><br>
    <strong>विशेषताएँ:</strong>
    <ul>
      <li>स्मार्ट सिटी – IoT आधारित अवसंरचना</li>
      <li>ग्रीन ट्रांसपोर्ट – EV, साइकिल ट्रैक</li>
      <li>पब्लिक स्पेस – पार्क, सामुदायिक केंद्र</li>
      <li>संसाधन दक्षता – जल, ऊर्जा, अपशिष्ट प्रबंधन</li>
    </ul>
  `
},
{

    question: "How many months are there in a year?",
    answer: "There are 12 months in a year.",
    keywords: "how many months year"
  },
  {

    question: "Which months are summer months?",
    answer: "March, April, May and June are summer months.",
    keywords: "summer months name"
  },
  {

    question: "Which months are winter months?",
    answer: "November, December, January and February are winter months.",
    keywords: "winter months name"
  },
  {

    question: "Which months are rainy season months?",
    answer: "June, July and August are rainy season months.",
    keywords: "rainy season months"
  },
  {
    question: "Which is the first month of the year?",
    answer: "January is the first month of the year.",
    keywords: "first month year"
  },
  {

    question: "Which is the last month of the year?",
    answer: "December is the last month of the year.",
    keywords: "last month year"
  }

];
