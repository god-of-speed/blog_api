<?php 

namespace App\Http\Controllers;

use App\Role;
use App\User;
use App\Topic;
use App\Comment;
use App\Content;
use App\TopicContent;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class IndexController extends Controller {
    public function index(Request $request) {
        try{
            $page = $request->query('page');
            if(isset($page) && is_int((int)$page)) {
                $start = ($page * 20) - 20;
            }else{
                $start = 0;
            }
            $contents = Content::where('isPublished',true)
                                ->skip($start)
                                ->take(20)
                                ->orderBy('updated_at','desc')
                                ->get();
            $totalResult = count(Content::where('isPublished',true)->orderBy('updated_at','desc')
                                         ->get());

            return response()->json(['result'=>[$contents,$totalResult]],200);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }

    public function topicContents(Request $request) {
        try{
            //get topic
        $topic = $request->query('topic');
        if(isset($topic) && is_int((int)$topic)) {
            $topic = Topic::find($topic);
            if($topic) {
                $page = $request->query('page');
                if(isset($page) && is_int((int)$page)) {
                    $start = ($page * 20) - 20;
                }else{
                    $start = 0;
                }
                $topicContents = TopicContent::leftJoin('contents',function($join){
                                    $join->on('topic_contents.contentId','=','contents.id');
                                })
                                ->where([
                                    ['topic_contents.topicId',$topic->id],
                                    ['contents.isPublished',true]
                                ])
                                ->skip($start)
                                ->take(20)
                                ->orderBy('topic_contents.updated_at','desc')
                                ->get();
                $totalResult = count(TopicContent::leftJoin('contents',function($join){
                    $join->on('topic_contents.contentId','=','contents.id');
                })
                ->where([
                    ['topic_contents.topicId',$topic->id],
                    ['contents.isPublished',true]
                ])
                ->skip($start)
                ->take(20)
                ->orderBy('topic_contents.updated_at','desc')
                ->get());

                //get content
                $contents = [];
                foreach($topicContents as $topicContent) {
                    $contents[] = Content::find($topicContent->contentId);
                }

                return response()->json(['result'=>[$contents,$totalResult]],200);
            }
        }
        return response()->json(['error'=>'Topic does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }

    public function content(Request $request) {
        try{
            //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                //get content topics
                $contentTopicsArr = TopicContent::where('contentId',$content->id)->get();
                $topics = [];
                foreach($contentTopicsArr as $cT) {
                    $topics[] = Topic::find($cT->topicId);
                }

                //get content comments
                $comments = Comment::where('contentId',$content->id)
                                     ->orderBy('updated_at','desc')
                                     ->get();
                //update content view
                $update = $content->update([
                    "views" => $content->views++
                ]);
                
                return response()->json(['result'=> [$content,$topics,$comments]],200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function topics() {
        try{
            //get topics
            $topics = Topic::orderBy('title','asc')
                            ->get();
            return response()->json(['topics'=>$topics],200);
        }catch(\Exception $error) {
            return response()->json(['error' => $error->getMessage()],500);
        }
    }

    public function roles() {
        try{
            //get roles
            $roles = Role::all();
            return response()->json(['roles'=>$roles],200);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function titleExist(Request $request) { 
        try{
            //get title
            $title = $request->query('title');
            //get content by title
            $content = Content::where('title',$title)->first();
            return response()->json($content == null ? false : true,200);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }

    public function requestUser(Request $request) {
        try{
            //get topic
            $user = $request->query('user');
            if(isset($user) && is_int((int)$user)) {
                $user = User::find($user);
                return response()->json(['user' => $user],200);
            }
            return response()->json(['error'=>'User does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }


    public function search(Request $request) {
        try{
            $search = $request->query('search');
            if($search != "") {
                $contents = Content::where(strtolower('title'),'like','%'.strtolower($search).'%')
                                    ->orderBy('created_at','desc')
                                    ->get();
                $totalResult = count($contents);
                return response()->json(['result'=>[$contents,$totalResult]],200);
            }
        }catch(\Exception $error) {
            return response()->json(['error' => 'Server error'],500);
        }
    }
}