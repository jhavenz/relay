<?php

namespace App\Http\Controllers\Api;

use App\Events\StateUpdated;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class StateController extends Controller
{
    public function get()
    {
        $state = $this->currentState();

        return response()->json($state);
    }

    public function set()
    {
        $state = \request()->input('state');
        $existingState = $this->currentState();

        File::put(storage_path('app/state.json'), json_encode(array_merge($existingState, $state), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

        event(new StateUpdated($state));

        return response()->json(['success' => true]);
    }

    private function currentState(): array|object
    {
        $state = File::exists(storage_path('app/state.json'))
            ? File::json(storage_path('app/state.json'))
            : null;

        if (is_null($state)) {
            return (object)[];
        }

        return $state;
    }
}
