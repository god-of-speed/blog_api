<?php

use Illuminate\Http\Request;

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::group(['middleware' => ['jwt']], function () {
    Route::group(['middleware' => ['isAdmin']], function () {
        Route::get('/publish_content','AdminController@publishContent');
        Route::get('/unpublish_content','AdminController@unpublishContent');
        Route::get('/delete_content','AdminController@deleteContent');
        Route::post('/create_topic','AdminController@createTopic');
        Route::post('/update_topic','AdminController@updateTopic');
        Route::get('/delete_topic','AdminController@deleteTopic');
        Route::get('/change_role','AdminController@changeRole');
        Route::get('/unpublished_contents','AdminController@unpublishedContents');
        Route::get('/users','AdminController@users');
    });

    Route::group(['middleware' => ['isAuthor']], function () {
        Route::post('/create_content','ContentController@createContent');
        Route::post('/update_content_body','ContentController@updateContentBody');
        Route::post('/update_content_featured_image','ContentController@updateContentFeaturedImage');
        Route::get('/update_content_view','ContentController@updateContentView');
        Route::get('/update_content_likes','ContentController@updateContentLikes');
        Route::post('/update_content_title','ContentController@updateContentTitle');
        Route::get('/delete_content','ContentController@deleteContent');
        Route::post('/update_content_topics','ContentController@updateContentTopics');
    });

    Route::group(['middleware' => ['isUser']], function () {
        Route::post('/create_comment','CommentController@createComment');
        Route::post('/update_comment','CommentController@updateComment');
        Route::get('/delete_comment','CommentController@deleteComment');
    
        Route::get('/user','UserController@user');
        Route::post('/update_avatar','UserController@updateAvatar');
        Route::get('/logMeOut','UserController@logMeOut');
    });
});

Route::post('/register','Auth\RegisterController@register');
Route::post('/login','Auth\LoginController@login');

Route::get('/','IndexController@index');
Route::get('/topic_contents','IndexController@topicContents');
Route::get('/content','IndexController@content');
Route::get('/topics','IndexController@topics');
Route::get('/roles','IndexController@roles');
Route::get('/request_user','IndexController@requestUser');
Route::get('/search','IndexController@search');

Route::fallback(function(){
    return response()->json(['error' => 'This link does not exist'],404);
});
