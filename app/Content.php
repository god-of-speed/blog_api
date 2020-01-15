<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Content extends Model
{
    use SoftDeletes;
        /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title','body','featuredImage',
       'featuredVideo','view','likes','isPublished','author'
    ];

    public function getAuthor() {
        return $this->belongsTo('App\Post','author');
    }
}
