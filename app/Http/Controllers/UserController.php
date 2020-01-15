<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller{

    public function user() {
        return response()->json(['user'=>auth()->user()],200);
    }

    public function updateAvatar(Request $request) {
        try{
            //get data
        $data = $request->only('avatar');

        //validate
        $validator = Validator::make($data,[
            'avatar' => ['mimeTypes:image/png,image/jpg,image/jpeg,image/PNG,image/JPG,image/JPEg']
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()],400);
        }

        //set user
        $user = auth()->user();
        if($user->avatar != null && file_exists(public_path().'/'.$user->avatar)) {
            unlink(public_path().'/'.$user->avatar);
        }

        //get created name
        $name = '';
        for($i=0; $i<10; $i++) {
            $letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            $name .= $letters[mt_rand(0,(strlen($letters) - 1))];
        }
        $name .= '.'.$data['avatar']->guessExtension();
        $dir = 'image/avatar/';

        if(!file_exists($dir)) {
            File::makeDirectory(public_path().'/'.$dir,0777,true,true);
        }

        $saveName = $dir.$name;
        if(move_uploaded_file($data['avatar'],public_path().'/'.$dir.$name)) {
            //update
        $update = $user->update([
            'avatar' => $saveName
        ]);
        
        return response()->json(['user'=>$user],200);
        }
        return response()->json(['error'=>'Failed to upload'],500);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }
}