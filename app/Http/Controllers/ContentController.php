<?php

namespace App\Http\Controllers;

use App\Role;
use App\Content;
use Carbon\Carbon;
use App\TopicContent;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ContentController extends Controller {
    public function createContent(Request $request) {
        try{
                    //get data
        $data = $request->only('title','featuredImage','body','topics');

        //validate data
        $validator = Validator::make($data,[
            'title' => ['required','string'],
            'body' => ['required'],
            'featuredImage' => ['required','mimeTypes:image/png,image/jpg,image/jpeg,image/PNG,image/JPG,image/JPEg']
        ]);

        //check if data validation failed
        if($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()],400);
        }
        
        //get saved featuredImage and featuredVideo name
        $featuredImage = $this->saveFeaturedImage($data['featuredImage']);
        //get body
        $body = $this->saveContentBody($data['body']);

        //create content
        $content = Content::create([
            'title' => ucwords(strtolower($data['title'])),
            'body' => $body,
            'featuredImage' => $featuredImage,
            'author' => auth()->user()->id
        ]);

        //get topics
        $topics = explode(',',$data['topics']);

        foreach($topics as $topic) {
            if(!TopicContent::where([
                ['topicId',(int)$topic],
                ['contentId',$content->id]
            ])->first()) {
                TopicContent::create([
                    'topicId' => (int)$topic,
                    'contentId' => $content->id
                ]);
            }
        }

        return response()->json(['content' => $content],200);
        }
        catch(\Exception $error) {
            return response()->json(['error'=>$error->getMessage()],500);
        }
    }

    public function saveFeaturedImage($featuredImage) {
        //get created name
        $name = '';
        for($i=0; $i<10; $i++) {
            $letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            $name .= $letters[mt_rand(0,(strlen($letters) - 1))];
        }
        $name .= '.'.$featuredImage->guessExtension();
        $dir = 'image/featuredImage/';

        if(!file_exists($dir)) {
            File::makeDirectory(public_path().'/'.$dir,0777,true,true);
        }

        $saveName = $dir.$name;
        move_uploaded_file($featuredImage,public_path().'/'.$dir.$name);
        return $saveName;
    }

    public function saveContentBody($body) {
        //get created name
        $name = '';
        for($i=0; $i<10; $i++) {
            $letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            $name .= $letters[mt_rand(0,(strlen($letters) - 1))];
        }
        $name .= '.txt';
        $dir = 'contents/body/';

        if(!file_exists($dir)) {
            File::makeDirectory(public_path().'/'.$dir,0777,true,true);
        }

        $saveName = $dir.$name;
        move_uploaded_file($body,public_path().'/'.$dir.$name);
        return $saveName;
    }


    public function saveFeaturedVideo($featuredVideo) {
        //get created name
        dd($featuredVideo->guessExtension());
        $name = '';
        for($i=0; $i<10; $i++) {
            $letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            $name .= $letters[mt_rand(0,(strlen($letters) - 1))];
        }
        $name .= '.'.$featuredVideo->guessExtension();
        $dir = 'video/featuredVideo/';
        if(!file_exists(public_path().'/'.$dir)) {
            File::makeDirectory(public_path().'/'.$dir,0777,true,true);
        }
        $saveName = $dir.$name;
        move_uploaded_file($featuredVideo,public_path().'/'.$dir.$name);

        return $saveName;
    }

    public function updateContentBody(Request $request) {
        try{
        //get data
        $data = $request->only('body');

        //validate
        $validator = Validator::make($data,[
            'body' => ['required']
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()],400);
        }
        
        //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content && $content->author == auth()->user()->id) {
                //delete previous body
                unlink(public_path().'/'.$content->body);
                //get body
                $body = $this->saveContentBody($data['body']);
                $update = $content->update([
                    'body' => $body,
                    'isPublished' => false
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist/Unauthorized'],405);
        }
            catch(\Exception $error) {
                return response()->json(['error'=>'Server error'],500);
            }
    }

    public function updateContentFeaturedImage(Request $request) {
        try{
                    //get data
        $data = $request->only('featuredImage');

        //validate
        $validator = Validator::make($data,[
            'featuredImage' => ['required','mimeTypes:image/png,image/jpg,image/jpeg,image/PNG,image/JPG,image/JPEg']
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()],400);
        }

        //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content && $content->author == auth()->user()->id) {
                //delete prev image
                unlink(public_path().'/'.$content->featuredImage);
                //get featuredImage name
                $featuredImage = $this->saveFeaturedImage($data['featuredImage']);
                $update = $content->update([
                    'featuredImage' => $featuredImage,
                    'isPublished' => false
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist/Unauthorized'],405);
        }
            catch(\Exception $error) {
                return response()->json(['error'=>'Server error'],500);
            }
    }

    public function updateContentView(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                $update = $content->update([
                    'views' => (int)$content->views++
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }
            catch(\Exception $error) {
                return response()->json(['error'=>$error->getMessage()],500);
            }
    }

    public function updateContentLikes(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                $update = $content->update([
                    'likes' => ($content->likes + 1)
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }
            catch(\Exception $error) {
                return response()->json(['error'=>'Server error'],500);
            }
    }

    public function updateContentTitle(Request $request) {
        try{
            //get data
        $data = $request->only('title');

        //validate
        $validator = Validator::make($data,[
            'title' => ['required','string']
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()],400);
        }
        //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content && $content->author == auth()->user()->id) {
                $update = $content->update([
                    'title' => ucwords(strtolower($data['title'])),
                    'isPublished' => false
                ]);
                return response()->json(['content'=> $content],200);
            }
        }
        return response()->json(['error'=>'Content does not exist/Unauthorized'],405);
        }
            catch(\Exception $error) {
                return response()->json(['error'=>'Server error'],500);
            }
    }

    public function deleteContent(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content  && $content->author == auth()->user()->id) {
                $update = $content->update([
                    'deletedAt' => Carbon::now()
                ]);
                return response()->json(true,200);
            }
        }
        return response()->json(['error'=>'Content does not exist/Unauthorized'],405);
        }
        catch(\Exception $error) {
            return response()->json(['error'=>'Server error'],500);
        }
    }

    public function updateContentTopics(Request $request) {
        try{
            //get data
            $data = $request->only('topics');
            $data['topics'] = explode(',',$data['topics']);
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content && $content->author == auth()->user()->id) {
                //get content topics
                $oldTopics = TopicContent::where('contentId',$content->id)->get();
                $oldTopicsArr = [];
                foreach($oldTopics as $oldTopic) {
                    $oldTopicsArr[] = $oldTopic->topicId; 
                }
                //get the difference between old and new topics and delete them
                $diffTopics = array_diff($oldTopicsArr,$data['topics']);
                foreach($diffTopics as $diffTopic) {
                    $topicContent = TopicContent::where([
                        ['topicId',$diffTopic],
                        ['contentId',$content->id]
                    ])->first();
                    $topicContent->delete();
                }
                
                foreach($data['topics'] as $dT) {
                    if(!array_search($dT,$oldTopicsArr)) {
                        $topicContent = TopicContent::create([
                            'topicId' => (int)$dT,
                            'contentId' => $content->id
                        ]);
                    }
                }

                return response()->json(true,200);
            }
        }
        return response()->json(['error'=>'Content does not exist/Unauthorized'],405);
        }catch(\Exception $error) {
            return response()->json(['error'=>$error->getMessage()],500);
        }
    }
}