function inject_svg_icons() {
  const svg_icons = [
    `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="url(#paint0_linear_26_119)"/>
      <path d="M14 21.5C14 20.3872 14.3376 19.3006 14.9681 18.3837C15.5987 17.4668 16.4925 16.7627 17.5316 16.3644C18.5707 15.9662 19.7062 15.8925 20.788 16.1531C21.8699 16.4137 22.8472 16.9963 23.591 17.824C23.6434 17.8801 23.7067 17.9247 23.7771 17.9552C23.8474 17.9858 23.9233 18.0015 24 18.0015C24.0767 18.0015 24.1526 17.9858 24.2229 17.9552C24.2933 17.9247 24.3566 17.8801 24.409 17.824C25.1504 16.9909 26.128 16.4034 27.2116 16.1396C28.2952 15.8759 29.4335 15.9484 30.4749 16.3475C31.5163 16.7467 32.4114 17.4535 33.0411 18.3739C33.6708 19.2944 34.0053 20.3848 34 21.5C34 23.79 32.5 25.5 31 27L25.508 32.313C25.3217 32.527 25.0919 32.699 24.834 32.8173C24.5762 32.9357 24.296 32.9979 24.0123 32.9997C23.7285 33.0015 23.4476 32.9429 23.1883 32.8278C22.9289 32.7127 22.697 32.5437 22.508 32.332L17 27C15.5 25.5 14 23.8 14 21.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_26_119" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2B7FFF"/>
          <stop offset="1" stop-color="#AD46FF"/>
        </linearGradient>
      </defs>
    </svg>
    `,
    `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="url(#paint0_linear_26_127)"/>
      <path d="M23.0005 32C21.2445 32.0053 19.5507 31.3505 18.255 30.1654C16.9592 28.9803 16.1562 27.3515 16.0052 25.6021C15.8542 23.8527 16.3662 22.1104 17.4396 20.7207C18.5131 19.3311 20.0696 18.3957 21.8005 18.1C27.5005 17 29.0005 16.48 31.0005 14C32.0005 16 33.0005 18.18 33.0005 22C33.0005 27.5 28.2205 32 23.0005 32Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.0002 33C14.0002 30 15.8502 27.64 19.0802 27C21.5002 26.52 24.0002 25 25.0002 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_26_127" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2B7FFF"/>
          <stop offset="1" stop-color="#AD46FF"/>
        </linearGradient>
      </defs>
    </svg>
    `,
    `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="url(#paint0_linear_26_136)"/>
      <path d="M16 26.0002C15.8108 26.0008 15.6252 25.9477 15.4649 25.8471C15.3047 25.7465 15.1762 25.6025 15.0945 25.4318C15.0129 25.2611 14.9813 25.0707 15.0035 24.8828C15.0257 24.6949 15.1008 24.5171 15.22 24.3702L25.12 14.1702C25.1943 14.0844 25.2955 14.0265 25.407 14.0059C25.5185 13.9853 25.6337 14.0032 25.7337 14.0567C25.8337 14.1102 25.9126 14.1961 25.9573 14.3003C26.0021 14.4045 26.0101 14.5208 25.98 14.6302L24.06 20.6502C24.0034 20.8017 23.9844 20.9647 24.0046 21.1252C24.0248 21.2857 24.0837 21.4388 24.1761 21.5716C24.2685 21.7043 24.3918 21.8127 24.5353 21.8873C24.6788 21.962 24.8382 22.0007 25 22.0002H32C32.1892 21.9995 32.3748 22.0526 32.535 22.1532C32.6953 22.2538 32.8238 22.3978 32.9054 22.5685C32.9871 22.7392 33.0187 22.9296 32.9965 23.1175C32.9743 23.3054 32.8992 23.4832 32.78 23.6302L22.88 33.8302C22.8057 33.9159 22.7045 33.9738 22.593 33.9944C22.4815 34.0151 22.3663 33.9972 22.2663 33.9437C22.1663 33.8902 22.0874 33.8043 22.0427 33.7001C21.9979 33.5958 21.9899 33.4795 22.02 33.3702L23.94 27.3502C23.9966 27.1986 24.0156 27.0356 23.9954 26.8752C23.9752 26.7147 23.9163 26.5615 23.8239 26.4287C23.7315 26.296 23.6082 26.1876 23.4647 26.113C23.3212 26.0384 23.1617 25.9996 23 26.0002H16Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_26_136" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2B7FFF"/>
          <stop offset="1" stop-color="#AD46FF"/>
        </linearGradient>
      </defs>
    </svg>
    `,
    `
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="url(#paint0_linear_26_144)"/>
      <path d="M32.0002 25C32.0002 30 28.5002 32.5 24.3402 33.95C24.1224 34.0238 23.8858 34.0202 23.6702 33.94C19.5002 32.5 16.0002 30 16.0002 25V18C16.0002 17.7347 16.1056 17.4804 16.2931 17.2929C16.4807 17.1053 16.735 17 17.0002 17C19.0002 17 21.5002 15.8 23.2402 14.28C23.4521 14.099 23.7216 13.9995 24.0002 13.9995C24.2789 13.9995 24.5484 14.099 24.7602 14.28C26.5102 15.81 29.0002 17 31.0002 17C31.2655 17 31.5198 17.1053 31.7074 17.2929C31.8949 17.4804 32.0002 17.7347 32.0002 18V25Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_26_144" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2B7FFF"/>
          <stop offset="1" stop-color="#AD46FF"/>
        </linearGradient>
      </defs>
    </svg>
    `
  ];

  const icon_elements = document.querySelectorAll(".principle_icon");

  icon_elements.forEach((icon, i) => {
    icon.innerHTML = svg_icons[i] || "";
  });
}


function inject_text(){
    const text_elements = document.querySelectorAll(".text");
    const explain_text_elements = document.querySelectorAll(".explain_text");

    const texts_used = [
        "User-Centric",
        "Eco-Friendly",
        "Innovation",
        "Reliability"
    ];
    const explain_texts_used = [
        "Every feature is designed with our users’ needs and convenience in mind.",
        "Promoting sustainable transportation to reduce our environmental impact.",
        "Leveraging cutting-edge technology to make travel smarter and easier.",
        "Providing accurate, real-time information you can trust."
    ];

    text_elements.forEach((el, i) => {
        el.textContent = texts_used[i] || "";
    });

    explain_text_elements.forEach((el, i) => {
        el.textContent = explain_texts_used[i] || "";
    });
}

function inject_info_box(){
    const svg_icons = [
        `
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H48V48H0V0Z" fill="url(#paint0_linear_26_281)"/>
            <path d="M28 33V31C28 29.9391 27.5786 28.9217 26.8284 28.1716C26.0783 27.4214 25.0609 27 24 27H18C16.9391 27 15.9217 27.4214 15.1716 28.1716C14.4214 28.9217 14 29.9391 14 31V33" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 15.1279C28.8578 15.3503 29.6174 15.8512 30.1597 16.552C30.702 17.2528 30.9962 18.1138 30.9962 18.9999C30.9962 19.886 30.702 20.7471 30.1597 21.4479C29.6174 22.1487 28.8578 22.6496 28 22.8719" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M34 32.9999V30.9999C33.9993 30.1136 33.7044 29.2527 33.1614 28.5522C32.6184 27.8517 31.8581 27.3515 31 27.1299" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 23C23.2091 23 25 21.2091 25 19C25 16.7909 23.2091 15 21 15C18.7909 15 17 16.7909 17 19C17 21.2091 18.7909 23 21 23Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_26_281" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stop-color="#DBEAFE"/>
            <stop offset="1" stop-color="#F3E8FF"/>
            </linearGradient>
            </defs>
            </svg>
        `,
        `
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H48V48H0V0Z" fill="url(#paint0_linear_26_292)"/>
            <path d="M20 18V24" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M27 18V24" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 24H33.6" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M30 30H33C33 30 33.5 28.3 33.8 27.2C33.9 26.8 34 26.4 34 26C34 25.6 33.9 25.2 33.8 24.8L32.4 19.8C32.1 18.8 31.1 18 30 18H16C15.4696 18 14.9609 18.2107 14.5858 18.5858C14.2107 18.9609 14 19.4696 14 20V30H17" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 32C20.1046 32 21 31.1046 21 30C21 28.8954 20.1046 28 19 28C17.8954 28 17 28.8954 17 30C17 31.1046 17.8954 32 19 32Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 30H26" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 32C29.1046 32 30 31.1046 30 30C30 28.8954 29.1046 28 28 28C26.8954 28 26 28.8954 26 30C26 31.1046 26.8954 32 28 32Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_26_292" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stop-color="#DBEAFE"/>
            <stop offset="1" stop-color="#F3E8FF"/>
            </linearGradient>
            </defs>
            </svg>
        `,
        `
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H48V48H0V0Z" fill="url(#paint0_linear_26_306)"/>
            <path d="M24 34C29.5228 34 34 29.5228 34 24C34 18.4772 29.5228 14 24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24 26C25.1046 26 26 25.1046 26 24C26 22.8954 25.1046 22 24 22C22.8954 22 22 22.8954 22 24C22 25.1046 22.8954 26 24 26Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_26_306" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stop-color="#DBEAFE"/>
            <stop offset="1" stop-color="#F3E8FF"/>
            </linearGradient>
            </defs>
            </svg>
        `,
        `
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H48V48H0V0Z" fill="url(#paint0_linear_26_316)"/>
            <path d="M23.0002 32C21.2443 32.0053 19.5505 31.3505 18.2547 30.1654C16.959 28.9803 16.156 27.3515 16.005 25.6021C15.8539 23.8527 16.3659 22.1104 17.4394 20.7207C18.5128 19.3311 20.0694 18.3957 21.8002 18.1C27.5002 17 29.0002 16.48 31.0002 14C32.0002 16 33.0002 18.18 33.0002 22C33.0002 27.5 28.2202 32 23.0002 32Z" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 33C14 30 15.85 27.64 19.08 27C21.5 26.52 24 25 25 24" stroke="#155DFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_26_316" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stop-color="#DBEAFE"/>
            <stop offset="1" stop-color="#F3E8FF"/>
            </linearGradient>
            </defs>
            </svg>
        `
    ];
    const data_text = [
        "50K+",
        "200+",
        "15",
        "2.5M KG"
    ];
    const label_text = [
       "Daily users",
        "Routes covered",
        "Cities served",
        "C02 saved"
    ];
    const info_box_icon = document.querySelectorAll(".info_box_icon");
    const info_box_text = document.querySelectorAll(".info_box_text");
    const info_box_unit = document.querySelectorAll(".info_box_unit");

    info_box_icon.forEach((el, i) => {
        el.innerHTML =  svg_icons[i] || "";
    });
    info_box_text.forEach((el, i) => {
        el.textContent =  data_text[i] || "";
    });
    info_box_unit.forEach((el, i) => {
        el.textContent =  label_text[i] || "";
    });
}

function createQuestion(question,answer) {
    // Create the main container
    let faqItem = document.createElement("div");
    faqItem.className = "faq-item";

    // Create the question button
    const questionBtn = document.createElement("button");
    questionBtn.className = "faq-question";
    questionBtn.textContent = question;

    // Create the answer container
    const answerDiv = document.createElement("div");
    answerDiv.className = "faq-answer";

    // Create the paragraph inside the answer
    const answerP = document.createElement("p");
    answerP.textContent = answer;

    // Put it all together
    answerDiv.appendChild(answerP);
    faqItem.appendChild(questionBtn);
    faqItem.appendChild(answerDiv);

    return faqItem;
}

// function inject_questions() {
//     const questions = [
//         "What is Tossal?",
//         "How does the route finder work?",
//         "Is Tossal free to use?",
//         "Which cities does Tossal cover?",
//         "How accurate is the real-time tracking?",
//         "Can I save my favorite routes?",
//         "Does Tossal sell tickets?",
//         "How do I report incorrect information?"
//     ];

//     const answers = [
//         `
//         Tossal is a comprehensive transportation platform that helps you find the best routes across buses, trains, trams, and taxis. We provide real-time schedules, cost comparisons, and smart route suggestions to make your journey easier.
//         `,
//         `
//         Simply enter your starting point and destination. Our AI-powered algorithm analyzes thousands of possible routes considering factors like time, cost, and environmental impact to suggest the best options for your journey.
//         `,
//         `
//         Yes! Tossal is completely free to use. We provide all our features including route planning, real-time tracking, and cost estimates at no cost to you.
//         `,
//         `
//         Tossal currently operates in 15 major cities with plans to expand to more locations. Check our coverage map for specific areas we serve.
//         `,
//         `
//         We receive real-time data directly from transport operators, updating every 30 seconds. Our accuracy rate is over 95% for arrival predictions.
//         `,
//         `
//         Yes! Create a free account to save your frequently used routes and access them quickly whenever you need them.
//         `,
//         `
//         Currently, Tossal focuses on route planning and information. We provide cost estimates and direct you to official ticketing platforms for purchases.
//         `,
//         `
//         You can submit feedback through our Complaints page. We review all reports within 24 hours and work with transport operators to ensure accuracy.
//         `
//     ];

//     const faq_container = document.querySelector(".question_container");
//     for (let i = 0; i < answers.length; i++) {
//         const faq = createQuestion(questions[i], answers[i]);
//         faq_container.appendChild(faq);
//     }
// }

// 889 

function createStafComp(text,unit){
    let staff_comp = document.createElement("div");
    staff_comp.className = "staff_info";

    let staff_text = document.createElement("p");
    staff_text.className = "info_box_text"; 
    staff_text.textContent = text;
    
    let staff_unit = document.createElement("p");
    staff_unit.className = "info_box_unit";
    staff_unit.textContent = unit;

    staff_comp.appendChild(staff_text);
    staff_comp.appendChild(staff_unit);

    return staff_comp;
}
    

function fill_out_staff(){
    const container = document.querySelector(".staff_container");

    const team      = createStafComp("25+","Team members");
    const countries = createStafComp("100","Countries");
    const remote    = createStafComp("100%","remote-first");

    container.appendChild(team      );
    container.appendChild(countries );
    container.appendChild(remote    );
}

/*
function createInfoBox(svg,t,u){
          <div class="info_box">
             <div class="info_box_icon"></div>
             <p class="info_box_text">filler</p>
             <p class="info_box_unit">fillers</p>
          </div>           
    const info_box = document.createElement("div");
    info_box.className = "info_box";

    const icon = document.createElement("div");
    icon.className("info_box_icon");
    icon.innerHTML = svg;

    const text = document.createElement("p");
    icon.className("info_box_text");
    icon.textContent = t;

    const unit = document.createElement("p");
    icon.className("info_box_unit");
    unit.textContent = u;
}

function inject_achiev(){
    const svg_values = [
        `
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H64V64H0V0Z" fill="url(#paint0_linear_26_241)"/>
<path d="M36.6359 33.1865L38.6559 44.5545C38.6785 44.6884 38.6598 44.826 38.6021 44.9489C38.5444 45.0718 38.4506 45.1741 38.3332 45.2423C38.2157 45.3104 38.0803 45.341 37.945 45.3301C37.8097 45.3192 37.6809 45.2673 37.5759 45.1812L32.8026 41.5985C32.5721 41.4264 32.2922 41.3334 32.0046 41.3334C31.7169 41.3334 31.437 41.4264 31.2066 41.5985L26.4252 45.1799C26.3203 45.2658 26.1917 45.3177 26.0566 45.3286C25.9214 45.3395 25.7861 45.309 25.6688 45.241C25.5515 45.1731 25.4576 45.071 25.3998 44.9483C25.342 44.8256 25.323 44.6883 25.3452 44.5545L27.3639 33.1865" stroke="#E17100" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32 34.6665C36.4183 34.6665 40 31.0848 40 26.6665C40 22.2482 36.4183 18.6665 32 18.6665C27.5817 18.6665 24 22.2482 24 26.6665C24 31.0848 27.5817 34.6665 32 34.6665Z" stroke="#E17100" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_26_241" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEF3C6"/>
<stop offset="1" stop-color="#FEF9C2"/>
</linearGradient>
</defs>
</svg>

        `,
        `
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H64V64H0V0Z" fill="url(#paint0_linear_26_250)"/>
<path d="M30.6666 42.6665C28.3253 42.6736 26.0669 41.8005 24.3392 40.2204C22.6116 38.6403 21.5409 36.4686 21.3395 34.136C21.1382 31.8034 21.8208 29.4803 23.2521 27.6275C24.6834 25.7747 26.7587 24.5274 29.0666 24.1332C36.6666 22.6665 38.6666 21.9732 41.3332 18.6665C42.6666 21.3332 43.9999 24.2398 43.9999 29.3332C43.9999 36.6665 37.6266 42.6665 30.6666 42.6665Z" stroke="#00A63E" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.6667 44C18.6667 40 21.1334 36.8533 25.4401 36C28.6667 35.36 32.0001 33.3333 33.3334 32" stroke="#00A63E" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_26_250" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#DCFCE7"/>
<stop offset="1" stop-color="#D0FAE5"/>
</linearGradient>
</defs>
</svg>

        `,
        `
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H64V64H0V0Z" fill="url(#paint0_linear_26_259)"/>
<path d="M37.3332 44V41.3333C37.3332 39.9188 36.7713 38.5623 35.7711 37.5621C34.7709 36.5619 33.4143 36 31.9998 36H23.9998C22.5853 36 21.2288 36.5619 20.2286 37.5621C19.2284 38.5623 18.6665 39.9188 18.6665 41.3333V44" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M37.3335 20.1704C38.4772 20.4669 39.49 21.1348 40.2131 22.0692C40.9361 23.0036 41.3284 24.1516 41.3284 25.3331C41.3284 26.5146 40.9361 27.6626 40.2131 28.597C39.49 29.5314 38.4772 30.1993 37.3335 30.4957" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M45.3335 44V41.3333C45.3326 40.1516 44.9393 39.0037 44.2153 38.0698C43.4913 37.1358 42.4777 36.4688 41.3335 36.1733" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.9998 30.6667C30.9454 30.6667 33.3332 28.2789 33.3332 25.3333C33.3332 22.3878 30.9454 20 27.9998 20C25.0543 20 22.6665 22.3878 22.6665 25.3333C22.6665 28.2789 25.0543 30.6667 27.9998 30.6667Z" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_26_259" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#DBEAFE"/>
<stop offset="1" stop-color="#CEFAFE"/>
</linearGradient>
</defs>
</svg>

        `
    ];

    const text = [
        "Best Transport App 2024",
        "Green initiative award",
        "User's choice 2024"
    ]

    const unit = [
       "Tech Innovation Awards", 
       "Environmental Council", 
       "App Store"
    ];
        
    const container = document.querySelector(".achiev_container");

    for(let i = 0 ; i < svg_values.length ; i ++){
        const created_comp = createInfoBox(svg_values[i],text[i],unit[i]);
        container.appendChild(created_comp);
    }
}
*/
function createInfoBox(svg, t, u) {
  const info_box = document.createElement("div");
  info_box.className = "info_box";

  const icon = document.createElement("div");
  icon.className = "info_box_icon";
  icon.innerHTML = svg; // svg is a string of SVG markup

  const text = document.createElement("p");
  text.className = "info_box_text";
  text.textContent = t;

  const unit = document.createElement("p");
  unit.className = "info_box_unit";
  unit.textContent = u;

  info_box.appendChild(icon);
  info_box.appendChild(text);
  info_box.appendChild(unit);

  return info_box;
}

function inject_achiev() {
  const svg_values = [
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H64V64H0V0Z" fill="url(#paint0_linear_26_241)"/>
<path d="M36.6359 33.1865L38.6559 44.5545C38.6785 44.6884 38.6598 44.826 38.6021 44.9489C38.5444 45.0718 38.4506 45.1741 38.3332 45.2423C38.2157 45.3104 38.0803 45.341 37.945 45.3301C37.8097 45.3192 37.6809 45.2673 37.5759 45.1812L32.8026 41.5985C32.5721 41.4264 32.2922 41.3334 32.0046 41.3334C31.7169 41.3334 31.437 41.4264 31.2066 41.5985L26.4252 45.1799C26.3203 45.2658 26.1917 45.3177 26.0566 45.3286C25.9214 45.3395 25.7861 45.309 25.6688 45.241C25.5515 45.1731 25.4576 45.071 25.3998 44.9483C25.342 44.8256 25.323 44.6883 25.3452 44.5545L27.3639 33.1865" stroke="#E17100" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32 34.6665C36.4183 34.6665 40 31.0848 40 26.6665C40 22.2482 36.4183 18.6665 32 18.6665C27.5817 18.6665 24 22.2482 24 26.6665C24 31.0848 27.5817 34.6665 32 34.6665Z" stroke="#E17100" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_26_241" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEF3C6"/>
<stop offset="1" stop-color="#FEF9C2"/>
</linearGradient>
</defs>
</svg>
`,
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H64V64H0V0Z" fill="url(#paint0_linear_26_250)"/>
<path d="M30.6666 42.6665C28.3253 42.6736 26.0669 41.8005 24.3392 40.2204C22.6116 38.6403 21.5409 36.4686 21.3395 34.136C21.1382 31.8034 21.8208 29.4803 23.2521 27.6275C24.6834 25.7747 26.7587 24.5274 29.0666 24.1332C36.6666 22.6665 38.6666 21.9732 41.3332 18.6665C42.6666 21.3332 43.9999 24.2398 43.9999 29.3332C43.9999 36.6665 37.6266 42.6665 30.6666 42.6665Z" stroke="#00A63E" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.6667 44C18.6667 40 21.1334 36.8533 25.4401 36C28.6667 35.36 32.0001 33.3333 33.3334 32" stroke="#00A63E" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_26_250" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#DCFCE7"/>
<stop offset="1" stop-color="#D0FAE5"/>
</linearGradient>
</defs>
</svg>
`,
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H64V64H0V0Z" fill="url(#paint0_linear_26_259)"/>
<path d="M37.3332 44V41.3333C37.3332 39.9188 36.7713 38.5623 35.7711 37.5621C34.7709 36.5619 33.4143 36 31.9998 36H23.9998C22.5853 36 21.2288 36.5619 20.2286 37.5621C19.2284 38.5623 18.6665 39.9188 18.6665 41.3333V44" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M37.3335 20.1704C38.4772 20.4669 39.49 21.1348 40.2131 22.0692C40.9361 23.0036 41.3284 24.1516 41.3284 25.3331C41.3284 26.5146 40.9361 27.6626 40.2131 28.597C39.49 29.5314 38.4772 30.1993 37.3335 30.4957" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M45.3335 44V41.3333C45.3326 40.1516 44.9393 39.0037 44.2153 38.0698C43.4913 37.1358 42.4777 36.4688 41.3335 36.1733" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.9998 30.6667C30.9454 30.6667 33.3332 28.2789 33.3332 25.3333C33.3332 22.3878 30.9454 20 27.9998 20C25.0543 20 22.6665 22.3878 22.6665 25.3333C22.6665 28.2789 25.0543 30.6667 27.9998 30.6667Z" stroke="#155DFC" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_26_259" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#DBEAFE"/>
<stop offset="1" stop-color="#CEFAFE"/>
</linearGradient>
</defs>
</svg>
`
  ];

  const texts = [
    "Best Transport App 2024",
    "Green initiative award",
    "User's choice 2024"
  ];

  const units = [
    "Tech Innovation Awards",
    "Environmental Council",
    "App Store"
  ];

  const container = document.querySelector(".achiev_container");
  if (!container) {
    console.error("No .achiev_container found in the document.");
    return;
  }

  for (let i = 0; i < svg_values.length; i++) {
    const created_comp = createInfoBox(svg_values[i], texts[i], units[i]);
    container.appendChild(created_comp);
  }
}

document.addEventListener("DOMContentLoaded",() =>  {
    inject_info_box();
    inject_svg_icons();
    inject_text();
    inject_questions();
    fill_out_staff();
    inject_achiev();

    const questions = document.querySelectorAll('.faq-question');

    questions.forEach((btn) => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            faqItem.classList.toggle('active');
        });
    });
});
