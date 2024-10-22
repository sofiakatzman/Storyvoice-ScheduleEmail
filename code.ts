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

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'import') {
        console.log("You hit import!");

        // Fetch Event Schedule from Airtable
        try {
            const response = await fetch('https://figma-airtable-server-c002f4b69d57.herokuapp.com/sv/schedule-email', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log("Fetched Data from Server:", data);

            // Logic that Addresses Each Email
            //@ts-expect-error-testing
            data.forEach(email => {
                // Create a new frame for email with Auto Layout
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

                // Generate "Pre-Schedule Section"
                const preschedule = "PRE-SCHEDULE";
                const preScheduleComponent = figma.currentPage.findOne(node => node.name === preschedule);

                if (preScheduleComponent && preScheduleComponent.type === 'COMPONENT') {
                    const preScheduleClone = (preScheduleComponent as ComponentNode).createInstance(); 

                    // Find Copy Fields
                    const herocopy = preScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'HERO-COPY') as TextNode;
                    const bodycopy = preScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'BODY-COPY') as TextNode;
                    const bodyctacopy = preScheduleClone.findOne(node => node.type === 'TEXT' && node.name === 'BODY-CTA-COPY') as TextNode;

                    // Replace Copy Fields
                    if (herocopy) {
                        herocopy.characters = email.EmailDetails.herocopy || "";
                    } else {
                        console.log("HERO-COPY not found");
                    }

                    if (bodycopy) {
                        bodycopy.characters = email.EmailDetails.bodycopy || "";
                    } else {
                        console.log("BODY-COPY not found");
                    }

                    if (bodyctacopy) {
                        bodyctacopy.characters = email.EmailDetails.bodyctacopy || "";
                    } else {
                        console.log("BODY-CTA-COPY not found");
                    }

                    // Append Section to Frame
                    emailFrame.appendChild(preScheduleClone);
                    console.log("Pre-Schedule Generated");
                } else {
                    console.log("ERROR: Component not found - Pre Schedule Module");
                }

                // Generate "Schedule Section"

                // Access Each live Event
                //@ts-expect-error-testing
                email.EmailDetails.LiveEvents.forEach(event => {

                    const showDate = "SHOW-DATE";
                    const showDateComponent = figma.currentPage.findOne(node => node.name === showDate && node.type === 'COMPONENT');
                    const showDateClone = (showDateComponent as ComponentNode).createInstance();
                    const showDateCopy = showDateClone.findOne(node => node.type === 'TEXT' && node.name === 'SHOW-DATE-COPY') as TextNode;
                    showDateCopy.characters = event.Date

                    // Append the show date section to the email frame
                    emailFrame.appendChild(showDateClone);

                    // Access Each Show
                    //@ts-expect-error-testing
                    event.Shows.forEach(show => {
                        console.log(show)

                        const showCard = "SHOW-CARD";
                        const showCardComponent = figma.currentPage.findOne(node => node.name === showCard && node.type === 'COMPONENT');
                        const showCardClone = (showCardComponent as ComponentNode).createInstance();

                        const showTitle = showCardClone.findOne(node => node.type === 'TEXT' && node.name === 'SHOW-TITLE') as TextNode;
                        const showGuest = showCardClone.findOne(node => node.type === 'TEXT' && node.name === 'SHOW-GUEST') as TextNode;
                        const showTime = showCardClone.findOne(node => node.type === 'TEXT' && node.name === 'SHOW-TIME') as TextNode;

                        showTitle.characters = show.showtitle
                        showGuest.characters = show.showguest
                        showTime.characters = show.showtime

                        // Append the show date section to the email frame
                        emailFrame.appendChild(showCardClone);    
                    })
                })
            
                // Generate Post Schedule Section    
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

                    console.log(email.EmailDetails)
                    // Replace Copy Fields (if found)
                    if (closingherocopy) {
                        closingherocopy.characters = email.EmailDetails.closingherocopy || "";
                    } else {
                        console.log("CLOSING-HERO not found");
                    }

                    if (closingcopy) {
                        closingcopy.characters = email.EmailDetails.closingcopy || "";
                    } else {
                        console.log("CLOSING-COPY not found");
                    }

                    if (closingctacopy) {
                        closingctacopy.characters = email.EmailDetails.closingctacopy || "";
                    } else {
                        console.log("CLOSING-CTA-COPY not found");
                    }

                    // Append Section to Frame
                    emailFrame.appendChild(postScheduleClone);
                    console.log("Post-Schedule Section Added");

                } else {
                    console.log("ERROR: POST-SCHEDULE component not found.");
                }

            });

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // figma.closePlugin();
};