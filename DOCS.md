Xperious API
============

Xperious is a travel planning application. This is the beginnings of xperious API. Currently API is only capable of basic plan search and detailed view of the results.

ATTENTION: this is by no means a complete API. It is under active development and is used only for xperious portal prototype.


Getting started
---------------

Xperious API is organized around REST. JSON will be returned for all responses including errors. HTTP status codes are used to indicate API errors. 

Currently API can perform read-only operations and no authentication is required whatsover.

Some responses might get BIG (like `plans/search`) so consider using gzip compression that will improve the performance a bit. Use header `Accept-Encoding: gzip` in the request to get the gziped response.


Plan
----

Plan is a central structure in xperious API. It includes full trip agenda with the separate items for each attraction, activity, event, lodging, car rental and other extras.

### GET plans/search

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/plans/search?query=whale+watching&country=is&terminal=keflavik&from=2013-06-21T10%3A00%3A00&to=2013-06-21T23%3A59%3A59&guests=3`
</p>

* `query` - search keyword
* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbreviation for destination country
* `terminal` - arrival terminal code in the destination country
* `from` - arrival date and time
* `to` - departure date and time
* `guests` - number of travellers

#### Response

Returns a list of up to 5 plans with items. Each plan item contains full description and media so no additional queries should be required in order to render the full plan properly.

``` js
[
   {
      "id": "7vzsoj2b7b",
      "country": "is",
      "from": 1371808800000,
      "to": 1371859199000,
      "items": [
          // contains all plan items like tranportation, activites, etc
          ...
      ],
      "pricePerPerson": {
         "price": "10.00",
         "currency": "EUR"
      },
      "price": {
         "price": "30.00",
         "currency": "EUR"
      },
      "durationInDays": 1
   },

   // contains up to five plans
   ...
]
```


Product
-------

Product can be of three types `ATTRACTION`, `ACTIVITY` or `RESTAURANT`. Products are building blocks for plan and can be free or paid.

### GET products/list

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/products/list?country=is&region=6&type=ATTRACTION&category=28`
</p>

* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbreviation for destination country
* `category` - category id
* `region` - region id
* `type` - currently only `ATTRACTION` is supported

#### Response

Returns all available products that match given preferences. That is they are in the specified country region and match the given type and category.

``` js
[
  {
    "id": 210,
    "type": "ATTRACTION",
    "title": "Dalatangi",
    "subtitle": "East as far as you can drive at gravel road in Mjóifjörður",
    "shortDescription": "The way to Dalatangi takes one along a rough and narrow trail along the northern coast of Mjóifjörður.&nbsp; A spectacular symphony awaits the traveler at the edge of the high and rugged shore: Waterfalls, steep cliffs an vales whith the roaring ocean below are not cut out for those suffering from vertigo!",
    "description": "The way to Dalatangi takes one along a rough and narrow trail along the northern coast of Mjóifjörður.&nbsp; A spectacular symphony awaits the traveler at the edge of the high and rugged shore: Waterfalls, steep cliffs an vales whith the roaring ocean below are not cut out for those suffering from vertigo!&nbsp; At the end of the road - as far eastward as possible - awaits the farm and the lighthouses.&nbsp; The newcomer is seized with an insular impression, all while contemplating the spectacular view of Loðmundarfjörður and Seydisfjörður, at times extending as far as the and at Mt. Glettingur in the far north.",
    "price": {
      "price": "0.00",
      "currency": "EUR"
    },
    "duration": 7200000,
    "images": [
      "http://media.xperious.com/content/files/public/product/20130401/1364835079913/Dalatangi.jpg",
      "http://media.xperious.com/content/files/public/product/20130401/1364835079913/Dalatangi1.jpg"
    ],
    "address": {
      "country": "IS",
      "town": null,
      "street": null,
      "streetNumber": null,
      "postalCode": "715",
      "roomNumber": null,
      "roadNumber": "953",
      "latitude": 65.26992,
      "longitude": -13.576355
    }
  },
  ...
]
```


### GET products/{id}

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/products/258`
</p>

* `{id}` - product id

#### Response

Retrieve a product by given id.

``` js
{
    "id": 258,
    "type": "ATTRACTION",
    "title": "Waterfall lane",
    "subtitle": "Seyðisfjörður",
    "shortDescription": "An easy and pleasant walk from the centre of Seyðisfjörður town, by a walkway partly gravel, partly grassy through a forested area towards the vale Fjarðarsel where beautiful waterfalls and varied greengrowth await the wanderer.&nbsp;",
    "description": "<span><i>Fjarðará River &amp; Fjarðarsel Museum<br><\/i>Duration: 2,5 and 4 hours / 2- 4 km.<\/span>Period: June - September<span>An easy and pleasant walk from the centre of Seyðisfjörður town, by a walkway partly gravel, partly grassy through a forested area towards the vale Fjarðarsel where beautiful waterfalls and varied greengrowth await the wanderer.&nbsp;<br>A visit to the oldest operational power plant in Iceland at Fjarðarsel (1913) is optional, provided that it is arranged beforehand.The plant marked a turning point in the history of Icelandic electrification. For the avid waterfall lover an added walk along the south side of Fjarðará river up to Neðri Stafur rock stratum, (300 m. alt.) is a must.&nbsp;<br>Out of a total of 25 waterfalls,in river Fjarðará some of the most spectacular ones can be seen along the way. At Neðri Stafur rock stratum, the wanderer is presented with exquisite view over Seyðisfjörður fjord and town, along with a fine selection of berries in late August. The scenic mountains, waterfalls, vegetation, and the history of town is a wonderful blend that makes this walk unforgettable.<\/span>",
    "price": {
      "price": "0.00",
      "currency": "EUR"
    },
    "duration": 7200000,
    "images": [
      "http://media.xperious.com/content/files/public/product/20130407/1365334184501/Waterfall-lane.jpg",
      "http://media.xperious.com/content/files/public/product/20130407/1365334184501/Waterfall-lane1.jpg",
      "http://media.xperious.com/content/files/public/product/20130407/1365334184501/Waterfall-lane2.jpg",
      "http://media.xperious.com/content/files/public/product/20130407/1365334184501/Waterfall-lane3.jpg",
      "http://media.xperious.com/content/files/public/product/20130407/1365334184501/Waterfall-lane4.jpg"
    ],
    "address": {
      "country": "IS",
      "town": null,
      "street": null,
      "streetNumber": null,
      "postalCode": "710",
      "roomNumber": null,
      "roadNumber": "93",
      "latitude": 65.26188,
      "longitude": -14.006195
    }
}
```



### GET products/search

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/products/search?lat=63.9964&lng=-22.6233&radius=50`
</p>

* `lat` - latitude
* `lng` - longitude
* `radius` - radius in kilometers


#### Response

Returns a list of products that are nearby given coordinates.

``` js
[
  {
    "product": {
      "id": 426,
      "type": "ACTIVITY",
      "title": "Reykjanes Swimming Center / Waterworld",
      "subtitle": "Swimming Pools",
      "shortDescription": "Waterworld&nbsp;is an indoor water park for the whole family. Admittance is free for children up to the age of 16.",
      "description": "Waterworld<span>&nbsp;is an indoor water park for the whole family. Admittance is free for children up to the age of 16. The park includes a heated activity pool for the youngest generation. There is also a 25 m long outdoor pool, a 50 m long indoor pool, 4 hot tubs and a steam bath<\/span>",
      "price": {
        "price": "2.50",
        "currency": "EUR"
      },
      "duration": 7200000,
      "images": [
        "http://media.xperious.com/content/files/public/product/20130512/1368389283320/vatnaverold2.jpg",
        "http://media.xperious.com/content/files/public/product/20130512/1368389283320/vatnaveroldelg.jpg"
      ],
      "address": {
        "country": "IS",
        "town": "Keflavík",
        "street": "SUNNUBRAUT",
        "streetNumber": "31",
        "postalCode": "230",
        "roomNumber": null,
        "roadNumber": null,
        "latitude": 63.998238,
        "longitude": -22.56081
      }
    },
    "distance": 3
  },
  ...
]
```



Terminal
--------

Terminal describes possible arrival and departure points in the destination country. Usually those are airports, bus and train stations. Xperious supports only predefined terminals for the country. Terminal is required for plan search.

### GET terminals/list

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/terminals/list?country=is`
</p>

* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbraviation for destination country

#### Response

Returns a list of supported arrival/departure terminals.

``` js
[
   {
      "code": "keflavik",
      "title": "Keflavik Airport",
      "latitude": 63.9964,
      "longitude": -22.6233
   },
   ...
]
```


Category
--------

Category is classification structure and is used to group the products into smaller groups.

### GET categories/list

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/categories/list?country=is&type=ATTRACTION`
</p>

* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbreviation for destination country
* `type` - currently only `ATTRACTION` is supported

#### Response

Returns all available categories that are assigned to products of given type and country.

``` js
[
  {
    "id": 26,
    "title": "For the Children"
  },
   ...
]
```



### GET categories/{id}

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/categories/26`
</p>

* `{id}` - category id

#### Response

Returns category by given id.

``` js
{
  "id": 26,
  "title": "For the Children"
}
```



Region
------

Region is a classification structure and is used to divide the country into smaller territories.


### GET regions/list

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/regions/list?country=is&category=26`
</p>

* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbreviation for destination country
* `category` - category id

#### Response

Returns all regions contained by products in the specified country and assigned to the given category.

``` js
[
  {
    "id": 14,
    "title": "Capital Area"
  },
  ...
]
```


Keyword
-------

Keywords are fragments of search query.


### GET keywords/suggest

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/keywords/suggest?country=is&term=whale`
</p>

* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbreviation for destination country
* `term` - prefix for suggestions

#### Response

Returns possible suggestions for given term.

``` js
[
  "whale",
  "whale watching"
]
```


Event
-----

Event is a special business or entertaiment occassion that traveller might use to plan his trip around.

### GET events/timeline

#### Request

<p class="url">
    `http://api.xperious.com/api/v1/events/timeline?country=is`
</p>

* `country` - [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) abbreviation for destination country

#### Response

Returns all available events for given country sorted by date in ascending order. 

``` js
[
  "whale",
  "whale watching"
]
```