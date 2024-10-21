"use strict";


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
                emailData = data
                console.log(emailData)
            })



    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
