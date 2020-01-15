<?php

namespace App\Http\Controllers\Auth;

use App\Role;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
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

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    public function register(Request $request) {
        try{
            //get data
        $data = $request->only('firstname','lastname','email','password');

        //validate data
        $validator = Validator::make($data,[
            'firstname' => ['required','string','max:255'],
            'lastname' => ['required','string','max:255'],
            'email' => ['required','email', 'unique:users'],
            'password' => ['required','string']
        ]);

        if($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()]);
        }

        //get role by title
        $role = Role::where('title','USER')->first();

        //create user
        $user = User::create([
            'name' => ucwords(strtolower($data['firstname']).' '.strtolower($data['lastname'])),
            'email' => $data['email'],
            'password' => \bcrypt($data['password']),
            'roleId' => $role->id
        ]);

        if(!$user) {
            return response()->json(['error'=>'Server error']);
        }

        $token = auth()->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60 * 24 * 7
        ]);
        }catch(\Exception $error){
            return response()->json(['error'=>$error]);
        }
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
