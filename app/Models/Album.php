<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Album extends Model
{
    use HasFactory;
    protected $table = 'popularalbum';
    protected $primary = 'id';
    protected $fillable = ['name','title','photo'];
}