<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{   /**
     *Gets player data
     *
     * @return void
    */
    public function getPlayers(){
        $players = Player::all();
        if($players){

            return response()->json(['success' => $players]);
        }else{
            return response()->json(['error' => 'Error getting players']);
        }
    }

    /**
     *Save player information
     *recieves ison information
     *@param Request $request the request that contains user name, game time and stars collected
     *@return Response json object 
     */
    public function savePlayer(Request $request){
        //make sure input is not empty
        if($request->name && $request->time && $request->stars >= 0){
            //store data in database here
            $player = new Player();
            $player->name = $request->name;
            $player->time = $request->time;
            $player->stars = $request->stars;
            $player->save();

            return response()->json(['message' => 'Saved successfully.']);
        }else{
            return response()->json(['message' => 'Name cannot be empty. Failed to save.'], 400);
        }

        
    }
}
