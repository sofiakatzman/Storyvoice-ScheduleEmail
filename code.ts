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

figma.ui.onmessage = (msg) => {
    if (msg.type === 'import') {
        console.log("you hit import !");
        let emailData = null;

        // *** 1. Call Airtable for Event Schedule ***
        fetch('https://api.airtable.com/v0/app85gJa99r7UJSLE/Schedule%20Email', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer patI59FkhJqFakzCs.bfef22ee25de7d1154dcab41932292eb91122d5f2768d94507c54b4ca6589311`,
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then((data) => {
            // *** 2. Save Event Schedule Email details ***
            emailData = data.records[data.records.length - 1].fields;
            console.log(emailData);

            // Create a new frame with Auto Layout
            const emailFrame = figma.createFrame();
            emailFrame.resize(1200, 1);
            emailFrame.layoutMode = "VERTICAL"; 
            emailFrame.primaryAxisAlignItems = "MIN"; 
            emailFrame.itemSpacing = 0; 
            emailFrame.paddingTop = 0; 
            emailFrame.paddingBottom = 0;
            emailFrame.paddingLeft = 0;
            emailFrame.paddingRight = 0;

            console.log("Email Frame Generated");

            // *** 3. Generate "Pre-Schedule Section" ***
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
                console.log("Pre-Schedule Generated");

            } else {
                console.log("ERROR: Component not found");
            }

            // *** 4. Generate Live Event Date Hero ***
            console.log("Generating Live Event Date Hero")
            const showDate = "SHOW-DATE";
            const showDateComponent = figma.currentPage.findOne(node => node.name === showDate && node.type === 'COMPONENT');
            const showDateClone = (showDateComponent as ComponentNode).createInstance();
            const showDateCopy = showDateClone.findOne(node => node.type === 'TEXT' && node.name === 'SHOW-DATE-COPY') as TextNode;
            showDateCopy.characters = emailData.ShowDate[0]
            
            // Append the show date section to the email frame
            emailFrame.appendChild(showDateClone);
            console.log("Schedule Header Generated");
            
            // *** 5. Generate "Post-Schedule Section" ***     
            const postSchedule = "POST-SCHEDULE";
            const postScheduleComponent = figma.currentPage.findOne(node => node.name === postSchedule && node.type === 'COMPONENT');

            if (postScheduleComponent) {
                console.log("Component found:", postScheduleComponent);
                const postScheduleClone = (postScheduleComponent as ComponentNode).createInstance();
                console.log("Node type:", postScheduleComponent.type);

                // Find Copy Fields
                const closingherocopy = postScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'CLOSING-HERO') as TextNode;
                const closingcopy = postScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'CLOSING-COPY') as TextNode;
                const closingctacopy = postScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'CLOSING-CTA-COPY') as TextNode;

                // Replace Copy Fields (if found)
                if (closingherocopy) {
                    closingherocopy.characters = emailData.ClosingHeroCopy || "";
                } else {
                    console.log("CLOSING-HERO not found");
                }

                if (closingcopy) {
                    closingcopy.characters = emailData.ClosingCopy || "";
                } else {
                    console.log("CLOSING-COPY not found");
                }

                if (closingctacopy) {
                    closingctacopy.characters = emailData.ClosingCTACopy || "";
                } else {
                    console.log("CLOSING-CTA-COPY not found");
                }

                // Append Section to Frame
                emailFrame.appendChild(postScheduleClone);
                console.log("Post-Schedule Section Added");

            } else {
                console.log("ERROR: POST-SCHEDULE component not found.");
            }

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }
    // Make sure to close the plugin when you're done.
    // figma.closePlugin();
};