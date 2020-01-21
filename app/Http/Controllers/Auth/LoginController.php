<?php

namespace App\Http\Controllers\Auth;

use App\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function login(Request $request) {
        //get email and password
        $credentials = $request->only(['email','password']);

        if(!$token = auth()->attempt($credentials)) {
            return response()->json(['error'=>'Invalid credentials'],406);
        }

        return response()->json([
            'user' => auth()->user(),
            'role' => Role::find(auth()->user()->roleId),
            'access_token' => $token,
            'token_type' => 'bearer'
        ]);
    }
}
