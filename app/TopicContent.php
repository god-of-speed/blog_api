<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TopicContent extends Model
{
    protected $fillable = ['topicId','contentId'];

    public function contents() {
        return $this->hasMany('App\Content','contentId');
    }

    public function topics() {
        return $this->hasMany('App\Topic','topicId');
    }
}
