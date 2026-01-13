import { getJson, overlay } from "./utility.js";
import { clickTile } from "./script.js";

const UNITS = await getJson("units.json")

let u = {
  "x-coordinate": 0,
  "y-coordinate": 0,
  "name":
  "health": 0,
  "movement": 0
}

function move(x, y, movement){
  clickTile
}

export{move}
//units.json {
   //  "melee": {
    //  "warrior": {
    //    "base": {
    //      "combat": 20,
    //      "movement": 2
     //      },
    //    "cost": {
    //      "production": 40,
    //      "gold": 160
    //    },
    //    "maintenance": {
      //    "gold": 1
    //    },
    //    "upgradesTo": "swordsman"
    //  },

//units table
    //DROP TABLE IF EXISTS units;
    //CREATE TABLE units (
    //    game INTEGER,
    ///    owner TEXT,
    //    x_pos INTEGER,
    //    y_pos INTEGER,
    //    name TEXT,
    //    health INTEGER,
    //    FOREIGN KEY (game) REFERENCES games(id),
    //    FOREIGN KEY (owner) REFERENCES profiles(username)
    //);
