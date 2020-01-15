<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['userId','contentId','comment','replyTo'];

    public function getContent() {
        return $this->belongsTo('App\Content','contentId');
    }

    public function getUser() {
        return $this->belongsTo('App\User','userId');
    }
}
