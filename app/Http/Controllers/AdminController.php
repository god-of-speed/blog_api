<?php

namespace App\Http\Controllers;

use App\Role;
use App\User;
use App\Topic;
use App\Content;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller {
    public function publishContent(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                $update = $content->update([
                    'isPublished' => true
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function unpublishContent(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                $update = $content->update([
                    'isPublished' => false
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function deleteContent(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                $content->delete();
                return response()->json(true,200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function createTopic(Request $request) {
        try{
            //get data
        $data = $request->only('topic');

        //validate
        $validator = Validator::make($data,[
            'topic' => ['required','string']
        ]);

        if($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()],400);
        }

        $topic = Topic::create([
            'title' => \strtoupper($data['topic'])
        ]);

        return response()->json(['topic' => $topic],200);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }

    public function updateTopic(Request $request) {
        try{
            $data = $request->only('topic');

            //validate
            $validator = Validator::make($data,[
                'topic' => ['required','string']
            ]);

            if($validator->fails()) {
                return response()->json(['errors'=>$validator->errors()],400);
            }

            //get topic
        $topic = $request->query('topic');
        if(isset($topic) && is_int((int)$topic)) {
            $topic = Topic::find($topic);
            if($topic) {
                $update = $topic->update([
                    'title' => strtoupper($data['topic'])
                ]);
                return response()->json(['topic'=> $topic],200);
            }
        }
        return response()->json(['error'=>'Topic does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function deleteTopic(Request $request) {
        try{
            //get topic
        $topic = $request->query('topic');
        if(isset($topic) && is_int((int)$topic)) {
            $topic = Topic::find($topic);
            if($topic) {
                $topic->delete();
                return response()->json(true,200);
            }
        }
        return response()->json(['error'=>'Topic does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function changeRole(Request $request) {
        try{
            //get user
        $user = $request->query('user');
        $newRole = $request->query('role');
        if(isset($user) && is_int((int)$user) && isset($newRole) && is_int((int)$newRole)) {
            $user = User::find($user);
            $role = Role::find($role);
            if($user && $role) {
                //get role  by title
                $update = $user->update([
                    'roleId' => $role->id
                ]);
                return response()->json(['user' => compact($user)],200);
            }
        }
        return response()->json(['error'=>'User or role does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function users(Request $request) {
        try{
            $page = $request->query('page');
            if(isset($page) && is_int((int)$page)) {
                $start = ($page * 20) - 20;
            }else{
                $start = 0;
            }
            $users = User::skip($start)
                                ->take(20)
                                ->orderBy('created_at','desc')
                                ->get();
            $totalResult = count(User::orderBy('created_at','desc')
                                         ->get());

            return response()->json(['result'=>[$users,$totalResult]],200);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }


    public function unpublishedContents(Request $request) {
        try{
            $page = $request->query('page');
            if(isset($page) && is_int((int)$page)) {
                $start = ($page * 20) - 20;
            }else{
                $start = 0;
            }
            $contents = Content::where('isPublished',false)
                                ->skip($start)
                                ->take(20)
                                ->orderBy('updated_at','desc')
                                ->get();
            $totalResult = count(Content::where('isPublished',false)->orderBy('updated_at','desc')
                                         ->get());

            return response()->json(['result'=>[$contents,$totalResult]],200);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }
}