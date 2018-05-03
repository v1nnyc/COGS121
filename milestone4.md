# Screenshots
![Images](/milestone_images/m4-1.png)
* **Intro Screen** -- We added this screen in order to be upfront about how we are collecting user data and to provide an understanding of what our service is. We also began to start thinking about what the front-end and theme could possible look in this iteration.

![Images](/milestone_images/m4-2.png)
* **Map Screen** -- In this screen, the map is now usable and utilizes Google Maps API in order to show markers within our SQLite3 database. The Contribute button is no longer a separate page but a pop-up within the maps page itself. We are planning on adding workable filters to the list view and look at how to differentiate between UCSD locations and where the user marks their WiFi location.

![Images](/milestone_images/m4-3.png)
* **Add Your Data** -- This pop up is now a pop up! We have added the ability for users to record their location speed and record the result into the database.

![Images](/milestone_images/m4-4.png)
* **Add Your Data After** -- This is a new screen and it serves as a confirmation that the record location worked. It displays the user speed back to to the user. After the location is triggered, it then will add a new marker into the maps where the user is currently located! We are still working getting a more accurate location speed itself.

# Approach to Privacy
We have taken a serious approach to user's privacy. We don't record any data that pertains to them personally and when we do, we explain exactly what we are using it for and explicitly request the exact type of data. For an example when we ask for a user's location it's not because we need that specific user's location, it's because we want a location for the wifi speed they are helping us document. We do not collect any personal information about our users, if two people were at the same spot, on the same wifi network, they would theoretically be considered the same data point, essentially indistinguishable from one another.
