<?php

namespace App\Http\Middleware;

use Closure;
use App\Role;
use Tymon\JWTAuth\Facades\JWTAuth;

class isUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {  
        //get user
        $user = auth()->user();
        if($user) {
            //get user role
            $role = Role::where('id',$user->roleId)->first();
            if($role && ($role->title == 'AUTHOR' || $role->title == 'ADMIN' || $role->title == 'USER')) {
                return $next($request);
            }
            return response()->json(['error'=>'Unauthorized'],403);
        }
        return response()->json(['error'=>'Unauthenticated'],401);
    }
}
