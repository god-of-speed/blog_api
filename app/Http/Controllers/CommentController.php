<?php 

namespace App\Http\Controllers;

use App\Comment;
use App\Content;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller {
    public function createComment(Request $request) {
        try{
            //get data
        $data = $request->only('comment','replyTo');

        //validate
        $validator = Validator::make($data,[
            'comment' => ['required','string']
        ]);

        if($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()]);
        }
        
        //get content
        $content = $request->query('content');
        if(isset($content) && is_int((int)$content)) {
            $content = Content::find($content);
            if($content) {
                $comment = Comment::create([
                    'contentId' => $content->id,
                    'userId' => auth()->user()->id,
                    'replyTo' => $data['replyTo'] != null ? $data['replyTo'] : null,
                    'comment' => $data['comment']
                ]);
                return response()->json(['comment'=> $comment],200);
            }
        }
        return response()->json(['error'=>'Content does not exist'],405);
        }catch(\Exception $error) {
            return response()->json(['error'=>$error->getMessage()],500);
        }
    }

    public function updateComment(Request $request) {
         //get data
         $data = $request->only('comment');

         //validate
         $validator = Validator::make($data,[
             'comment' => ['required','string']
         ]);
 
         if($validator->fails()) {
             return response()->json(['errors'=>$validator->errors()]);
         }

         //get content
        $comment = $request->query('comment');
        if(isset($comment) && is_int((int)$comment)) {
            $comment = Comment::find($comment);
            if($comment  && $comment->userId == auth()->user()->id) {
                $update = $comment->update([
                    'comment' => $data['comment']
                ]);
                return response()->json(['comment'=> $comment],200);
            }
        }
        return response()->json(['error'=>'Comment does not exist'],405);
    }

    public function deleteComment(Request $request) {
        //get content
        $comment = $request->query('comment');
        if(isset($comment) && is_int((int)$comment)) {
            $comment = Comment::find($comment);
            if($comment && $comment->userId == auth()->user()->id) {
                $comment->delete();
                return response()->json(true,200);
            }
        }
        return response()->json(['error'=>'Comment does not exist'],405);
    }
}