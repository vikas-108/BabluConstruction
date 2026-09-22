# BuildSkil Booking Web Version

This package ports the current React Native booking flow to plain HTML + CSS + JavaScript.

## Pages
- find-better.html
- book-user.html
- booked-users.html
- work-requests.html
- address.html

## Shared files
- booking-store.js
- search-data.js
- booking.css

## Storage
React Native AsyncStorage has been replaced with browser localStorage/sessionStorage for the HTML version. The keys are preserved:
- buildskil_bookings_v2
- buildskil_booked_users_v1
- buildskil_my_address_v1
- buildskil_my_addresses_v2
- cb_login_user

## API
Find Better uses the existing public profile endpoint:
https://api.buildskil.com/api/profiles/public

Booking records are client-side in this version because no booking backend endpoint was supplied in the source. That means the booking is shared only within the same browser storage. For two different devices/users, add a backend booking API/model and replace the localStorage read/write functions.

Serve these files from a web server rather than file:// when testing browser geolocation.
