<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ApiController extends Controller
{
    public function getSuggestions(Request $request, $query) {
        $client = new Client();
        $response = $client->get(env('GOOGLE_PLACE_API_BASE_URL') . 'autocomplete/json?input=' . $query . '&key=' . env('GOOGLE_API_KEY'));
        return $response->getBody();
    }

    public function getLatLang(Request $request, $placeId) {
        $client = new Client();
        $response = $client->get(env('GOOGLE_PLACE_API_BASE_URL') . 'details/json?placeid=' . $placeId . '&fields=geometry&key=' . env('GOOGLE_API_KEY'));
        return $response->getBody();
    }

    public function getForecast(Request $request, $lat, $lng) {
        $client = new Client();
        $response = $client->get(env('DARK_SKY_API_BASE_URL') . env('DARK_SKY_API_KEY') . '/' . $lat . ',' . $lng);
        return $response->getBody();
    }
}
