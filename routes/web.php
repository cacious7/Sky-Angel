<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlayerController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//the game's home page
 Route::get('/', function(){
     return view('welcome');
 });

 //handles saving of player game data to the database
 Route::post('/save', [PlayerController::class, 'savePlayer'])->name('save.player');

 //handles getting players' saved game data from the database
 Route::get('/getplayers', [PlayerController::class, 'getPlayers'])->name('get.players');