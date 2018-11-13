<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/suggest/{query}', 'ApiController@getSuggestions');

Route::get('/location/{placeId}', 'ApiController@getLatLang');

Route::get('/forecast/{lat}/{lng}', 'ApiController@getForecast');