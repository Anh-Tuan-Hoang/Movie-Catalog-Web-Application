# Anh Tuan Hoang

## Data base creation : all I have used for database is in Assignment 2 database.For this asssignment I test with user_id 9999

### MOVIES table

![movies](MOVIES_dtb.png)

### MOVIES_POSTER link table

![movies](MOVIES_Poster_dtb.png)

### completedWatchList table (initial empty)

![completedwatchlist](completedwatchlist_dtb.png)

### toWatchList table (initial empty)

![towatchlist](towatchlist_dtb.png)

### Login display (always direct to until apikey is get or refresh website)

![login](login.png)
![login](login2.png)

### Home (when login succesful)

![home](Home.png)

### Towatchlist initial (when login succesful)

![Towatchlist initial](towatchlist_init.png)

### Watchedlist initial (when login succesful)

![Watchedlist initial](watchedlist_init.png)

### Add to watchlist test (when at least 1 tickbox is selected, the update button is appeared, the tickbox is disable when the movies is seen-we will test this later).
Default priority is 5

![testaddTWL](addTWL1.png)
![testaddTWL](addTWL2.png)
![testaddTWL](addTWL3.png)

### Add to watchlist error : when it already in watchlist < do nothing >

![arroraddTWL](addTWL_error1.png)
![erroraddTWL](addTWL_error2.png)

### Priority update

![priorityTWLupdate](pri_upd1.png)
![priorityTWLupdate](pri_upd2.png)

### Priority update error when priority is not in range 1-10

![priorityTWLupdateError](pri_upd_error.png)

### Priority sort (befor after tickbox is ticked)

![priorityTWLsort](sort_pri_before.png)
![priorityTWLsort](sort_pri_after.png)

### Filter by categories

![filterbycategory](cate_select1.png)
![filterbycategory](cate_select2.png)
![filterbycategory](cate_select3.png)

### Movies details (redirect to a page for showing detail (get param id) when view detail button clicked)

![details](detail1.png)
![details](detail2.png)
![details](detail3.png)

### Movies searching (return list of movies with search keyword)

![search](search1.png)
![search](search2.png)
![search](search3.png)

### Movies add from towatchlist to watchedlist (when add button is clicked, the movie is moved from towatchlist to watchedlist with default score of 2)

![watchedmark](watchedmark1.png)
![watchedmark](watchedmark2.png)
![watchedmark](watchedmark3.png)

### Well, when a movie is in watched list, it can not be added to towatchlist again from home, tickbox disable

![disable tickbox](addTWLdis.png)

### Remove movies

![remove](rm1.png)
![remove](rm2.png)

### Update watched time

![updateWT](updateWT1.png)
![updateWT](updateWT2.png)
![updateWT](updateWT3.png)

### Update watched time error when new time is less than old time (Avatar from 14 to 10)

![updateWT_error](updateWT_error.png)

### Update score

![updateScore](score1.png)
![updateScore](score2.png)
![updateScore](score3.png)

### Update score: when score is less than 1 or more than 10, error message is shown.Movies terminator

![updateScore](score_error.png)

### Rating sort (befor after tickbox is ticked)

![ratingTWLsort](sort_rate_before.png)
![ratingTWLsort](sort_rate_after.png)

### Error page

![error](error.png)