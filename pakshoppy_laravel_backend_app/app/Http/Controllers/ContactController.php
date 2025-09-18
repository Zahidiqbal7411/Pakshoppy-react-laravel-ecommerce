<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
          'name' => 'required|string|max:255',
          'email' => 'required|email|max:255',
        ]);

        $contact = Contact::create([
          'name' => $request->name,
          'email' => $request->email,
        ]);

        return response()->json(['message' => 'Contact saved', 'contact' => $contact], 201);
    }
}
