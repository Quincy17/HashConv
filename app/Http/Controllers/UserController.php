<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function searchUser(Request $request)
    {
        $query = strtolower($request->get('query')); // Ubah ke lowcase biar lebih fleksibel

        $users = \App\Models\User::whereRaw('LOWER(name) LIKE ?', ["%{$query}%"])
            ->where('user_id', '!=', Auth::user()->user_id) // tampilkan user selain yang login
            ->select('user_id', 'name', 'avatar')
            ->limit(10)
            ->get();

        return response()->json($users);
    }
}
