<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'Super Admin',
            'Admin',
            'Warehouse Staff',
            'Manager',
        ];

        foreach ($roles as $role) {
            Role::findOrCreate($role, 'web');
        }
    }
}