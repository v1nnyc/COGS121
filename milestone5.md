# Screenshots
![Images](/milestone_images/m4-1.png)
* **Intro Screen** -- This is the same screen as what we had in milestone 4.

![Images](/milestone_images/m5-1.png)
* **Map Screen** -- The list items have been updated to look much better and are a consistent size. We switched to using bootstrap instead of straight css. We've added real buttons to order list items between fastest or closest to 
the user's current location. We also added buttons to change between networks. We added custom markers which are numbered and match the list items, and will update when the list items are reordered. The dots on the map will also
update when the network is changed.

![Images](/milestone_images/m5-2.png)
* **Add Your Data** -- The pop up has not changed too much, but it will be updated soon. Soon it will ask users for
the wifi network they are currently on, since it's impossible for us to get that information automatically.

![Images](/milestone_images/m5-3.png)
* **Add Your Data After** -- This confirmation screen has also not changed much. We've included our figma files below which show a mock up for what we would like the pop up to look like eventually.

![Images](/milestone_images/m5-4.png)

# User Action 1
The user is able to filter the list results and numbered markers by either 1) the fastest average internet speed or 2) the location which is closest to their current locations. The filter buttons are at the top and act as a toggle. If the user refuses location sharing with us, when they click on the "closest" filter, a pop up with come up saying we need their location in order to do this, and the toggle will go back to "fastest" as selected.

# User Action 2
The user is able to change which network they are seeing information for, by using the other toggle at the top of the page. When selecting a different network to display, the list items will update to show the average speed for that network, and the numbered markers will update accordingly. Also, the "dots", or the small circles which represent individual speed tests, will update to show the speed tests on that network. 

#User Action 3
The user is able to test their current wifi speed, by clicking the "contribute" button, and clicking add my internet speed. When the speed is finished testing, they will get confirmation of their speed, and then the main page will show their speed "dot" on the map. 