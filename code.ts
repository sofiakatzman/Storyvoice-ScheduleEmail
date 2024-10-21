"use strict";
async function loadFonts() {
  const fonts = [
      { family: "Inter", style: "Regular" },
      { family: "Inter", style: "Bold" },
      { family: "Inter", style: "Italic" },
      { family: "Arial", style: "Bold" },
  ];

  try {
      await Promise.all(fonts.map(font => figma.loadFontAsync(font)));
      console.log("All fonts loaded successfully!");
  } catch (error) {
      console.error("Failed to load fonts:", error);
  }
}


loadFonts();

figma.showUI(__html__);
//(Each Email can have multiple live events, Each live Event can have multiple Shows, Each Show has One Guest, One Title, One Show-Time)
// *** 1. Call Airtable for Event Schedule ***
// *** 2. Save Event Schedule Email details ***
// *** 3. Generate "Pre-Schedule  Section" ***
// *** 4. Iterate through each Event ***
    // *** 5. Generate Live Event Date Hero ***
        // *** 5.a. Iterate through each Show ***
            // *** 5.b. Call Airtable for Show details ***
            // *** 5.c. Generate "Schedule Section" ***
// *** 6. Generate "Post-Schedule Section" ***
// *** 7. Autolayout all nodes and title frame

//Typings from AT Requests:
  //Email:
    //hero-copy: string
    //body-copy: string
    //body-cta-copy: string
    //body-cta-link: string
    // closing-hero-copy: string
    // closing-copy: string
    // closing-cta-copy: string
    // closing-cta-link: string
    //Events: [array of shows]
  //Events:
    // Shows: [array]
    // Name: string

  //Shows:
    //  show-title: string
    // show-guest: string
    // show-time: string



figma.ui.onmessage = (msg) => {
    if (msg.type === 'import') {
            console.log("you hit import !")
            let emailData = null

            // *** 1. Call Airtable for Event Schedule ***
          fetch('https://api.airtable.com/v0/app85gJa99r7UJSLE/Schedule%20Email', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer -`,
                  'Content-Type': 'application/json'
                }
              })
              .then(r => r.json())
              .then((data) => {
            // *** 2. Save Event Schedule Email details ***
                emailData = data.records[data.records.length-1].fields
                console.log(emailData)

              // Create a new frame with Auto Layout
                const emailFrame = figma.createFrame();
                emailFrame.resize(1200, 1);
                emailFrame.layoutMode = "VERTICAL"; 
                emailFrame.primaryAxisAlignItems = "MIN"; 
                emailFrame.primaryAxisAlignItems = "MIN"; 
                emailFrame.itemSpacing = 0; 
                emailFrame.paddingTop = 0; 
                emailFrame.paddingBottom = 0;
                emailFrame.paddingLeft = 0;
                emailFrame.paddingRight = 0;


            // *** 3. Generate "Pre-Schedule  Section" ***
                const preschedule = "PRE-SCHEDULE";
                const preScheduleComponent = figma.currentPage.findOne(node => node.name === preschedule && node.type === 'COMPONENT');

                if (preScheduleComponent) {
                  console.log("Component found:", preScheduleComponent);
                  const preScheduleClone = (preScheduleComponent as ComponentNode).createInstance();
                  console.log("Node type:", preScheduleComponent.type);

                  // Find Copy Fields
                  const herocopy = preScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'HERO-COPY') as TextNode;
                  const bodycopy = preScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'BODY-COPY') as TextNode;
                  const bodyctacopy = preScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'BODY-CTA-COPY') as TextNode;

                  // Replace Copy Fields (if found)
                  if (herocopy) {
                    herocopy.characters = emailData.HeroCopy || "";
                  } else {
                      console.log("HERO-COPY not found");
                  }

                  if (bodycopy) {
                      bodycopy.characters = emailData.BodyCopy || "";
                  } else {
                      console.log("BODY-COPY not found");
                  }

                  if (bodyctacopy) {
                      bodyctacopy.characters = emailData.BodyCTACopy || "";
                  } else {
                      console.log("BODY-CTA-COPY not found");
                  }

                  // Append Section to Frame
                  emailFrame.appendChild(preScheduleClone);

                } else {
                    console.log("ERROR: Component not found");
                }
                

            })   


    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
