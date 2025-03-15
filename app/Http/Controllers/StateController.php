<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class StateController extends Controller
{
    public function get()
    {
        $state = File::exists(storage_path('app/state.json'))
            ? File::get(storage_path('app/state.json'))
            : '{}';

        return response()->json(json_decode($state, true));
    }

    public function set(Request $request)
    {
        $state = $request->input('state');
        File::put(storage_path('app/state.json'), json_encode($state));
        return response()->json(['success' => true]);
    }
}
