<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School;
use App\Models\Teacher;
use App\Models\ClassModel;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;
use App\Events\UserRegistered;

use App\Http\Resources\User as UserResource;

class UserController extends Controller
{

  public function index() {
    $users = User::Paginate(15);

    return UserResource::collection($users);
  }

  /*
    function to signup users to the app
  */
  public function signup(Request $request) {
    // validating the forms data
    $this->validate($request, [
        'firstname' => 'required',
        'lastname' => 'required',
        'phone' => 'required',
        'username' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required',
        'school' => 'required',
        'roles' => 'required',
        'level' => 'required',
        'hasTeacherObject' => 'required'
      ]);

    $user = new User([
      'user_firstname' => $request->input('firstname'),
      'user_lastname' => $request->input('lastname'),
      'user_phone' => $request->input('phone'),

      'username' => $request->input('username'),
      'email' => $request->input('email'),
      'password' => bcrypt($request->input('password')),

      'school' => $request->input('school'),
      'approved' => false,
      'roles' => $request->input('roles'),
      'level' => $request->input('level'),
      'avatar' => $request->input('avatar'),
      'hasTeacherObject' => $request->input('hasTeacherObject'),

      // TODO: add created by field
      'creatdBy' => JWTAuth::parseToken()->toUser()->username,
      'updatedBy' => JWTAuth::parseToken()->toUser()->username
    ]);
    
    if ($user->save()) {

      // call event to send activation
      // event(new UserRegistered($user));

      // return a json response
      return response()->json([
        'message' => 'Sussesfuly added User'
      ], 201);
    }
  }

  /*
    function to sigin users to the app
  */ 
  public function signin(Request $request) {
    // validating the forms data
    $this->validate($request, [
        'username' => 'required',
        'password' => 'required'
      ]);

    $credentials = $request->only('username', 'password');

    try {
      if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json([
          'error' => 'Invalid Credentials!'
          ], 401);
      }
    } catch (JWTException $e) {
      return response()->json([
        'error' => 'Could not create Token!'
        ], 500);
    }

    // succss creating token return the token
    return response()->json([
      'token' => $token
      ], 201); 
  }

  /*
    function to get a the loged in user info and the school data
  */
  public function userInfo() {
    // get the current user by passing the token
    $user = JWTAuth::parseToken()->authenticate();
    $schoolId = JWTAuth::parseToken()->toUser()->school;

    $schoolInfo = [];

    // get school info
    $schoolInfo['school'] = School::where('id', $schoolId)->get();

    // get teachers of school
    $schoolInfo['teachers'] = Teacher::where('teacher_school_id', $schoolId)->get();

    // get classes of school
    $schoolInfo['classes'] = ClassModel::where('school', $schoolId)->get();

    return response()->json([
      'user' => $user,
      'schInfo' => $schoolInfo
      ]);
  }
}
