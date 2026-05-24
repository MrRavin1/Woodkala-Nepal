<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::updateOrCreate(['email' => 'admin@wood-kala.com'], [
            'name'     => 'Admin',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Seller
        $seller = User::updateOrCreate(['email' => 'seller@wood-kala.com'], [
            'name'             => 'Ram Bahadur',
            'password'         => Hash::make('password'),
            'role'             => 'seller',
            'shop_name'        => 'Himalayan Wood Works',
            'shop_description' => 'Premium handcrafted furniture from the hills of Nepal.',
            'phone'            => '9841000001',
        ]);

        // Customer
        User::updateOrCreate(['email' => 'customer@wood-kala.com'], [
            'name'     => 'Sita Sharma',
            'password' => Hash::make('password'),
            'role'     => 'customer',
            'phone'    => '9841000002',
            'address'  => 'Kathmandu, Nepal',
        ]);

        // Categories
        $categories = [
            ['name' => 'Chairs',      'slug' => 'chairs',      'description' => 'Handcrafted wooden chairs for every room.'],
            ['name' => 'Tables',      'slug' => 'tables',      'description' => 'Dining, coffee, and study tables.'],
            ['name' => 'Beds',        'slug' => 'beds',        'description' => 'Solid wood beds and bed frames.'],
            ['name' => 'Sofas',       'slug' => 'sofas',       'description' => 'Wooden frame sofas and lounges.'],
            ['name' => 'Shelves',     'slug' => 'shelves',     'description' => 'Bookshelves and wall units.'],
            ['name' => 'Decor',       'slug' => 'decor',       'description' => 'Wooden decorative items and accents.'],
            ['name' => 'Living Room', 'slug' => 'living-room', 'description' => 'Furniture for your living room.'],
            ['name' => 'Bedroom',     'slug' => 'bedroom',     'description' => 'Bedroom furniture and accessories.'],
            ['name' => 'Office',      'slug' => 'office',      'description' => 'Home office and workspace furniture.'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $chairs     = Category::where('slug', 'chairs')->first();
        $tables     = Category::where('slug', 'tables')->first();
        $beds       = Category::where('slug', 'beds')->first();
        $sofas      = Category::where('slug', 'sofas')->first();
        $shelves    = Category::where('slug', 'shelves')->first();
        $decor      = Category::where('slug', 'decor')->first();
        $livingRoom = Category::where('slug', 'living-room')->first();
        $bedroom    = Category::where('slug', 'bedroom')->first();
        $office     = Category::where('slug', 'office')->first();

        // Products
        $products = [
            // Chairs
            ['name' => 'Royal Teak Dining Chair',    'category_id' => $chairs->id,  'price' => 4500,  'stock' => 20, 'material' => 'Teak Wood',   'dimensions' => '45×50×90 cm',   'description' => 'Elegant teak dining chair with smooth finish and ergonomic design.', 'images' => ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80']],
            ['name' => 'Rustic Oak Armchair',         'category_id' => $chairs->id,  'price' => 8500,  'stock' => 12, 'material' => 'Oak Wood',    'dimensions' => '65×70×95 cm',   'description' => 'Solid oak armchair with natural grain texture.', 'images' => ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80']],
            ['name' => 'Bamboo Accent Chair',         'category_id' => $chairs->id,  'price' => 3200,  'stock' => 15, 'material' => 'Bamboo',      'dimensions' => '50×55×85 cm',   'description' => 'Lightweight bamboo accent chair, eco-friendly and stylish.', 'images' => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80']],
            ['name' => 'Walnut Rocking Chair',        'category_id' => $chairs->id,  'price' => 12000, 'stock' => 6,  'material' => 'Walnut Wood', 'dimensions' => '60×80×100 cm',  'description' => 'Classic walnut rocking chair, handcrafted for ultimate comfort.', 'images' => ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80']],

            // Tables
            ['name' => 'Sheesham Wood Dining Table', 'category_id' => $tables->id,  'price' => 28000, 'stock' => 5,  'material' => 'Sheesham',    'dimensions' => '180×90×76 cm',  'description' => 'Solid sheesham wood dining table for 6 persons. Rich grain pattern.', 'images' => ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80']],
            ['name' => 'Mango Wood Coffee Table',    'category_id' => $tables->id,  'price' => 9500,  'stock' => 10, 'material' => 'Mango Wood',  'dimensions' => '110×60×45 cm',  'description' => 'Beautiful mango wood coffee table with lower shelf for storage.', 'images' => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80']],
            ['name' => 'Teak Study Desk',            'category_id' => $tables->id,  'price' => 15000, 'stock' => 8,  'material' => 'Teak Wood',   'dimensions' => '120×60×75 cm',  'description' => 'Spacious teak study desk with two drawers. Ideal for home office.', 'images' => ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80']],
            ['name' => 'Folding Wooden Side Table',  'category_id' => $tables->id,  'price' => 3800,  'stock' => 18, 'material' => 'Pine Wood',   'dimensions' => '50×50×55 cm',   'description' => 'Compact folding side table, easy to store and move around.', 'images' => ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80']],

            // Beds
            ['name' => 'King Size Teak Bed Frame',   'category_id' => $beds->id,    'price' => 55000, 'stock' => 4,  'material' => 'Teak Wood',   'dimensions' => '200×180×120 cm', 'description' => 'Majestic king size teak bed frame with carved headboard.', 'images' => ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80']],
            ['name' => 'Queen Sheesham Bed',         'category_id' => $beds->id,    'price' => 38000, 'stock' => 6,  'material' => 'Sheesham',    'dimensions' => '200×160×110 cm', 'description' => 'Queen size sheesham bed with storage drawers underneath.', 'images' => ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80']],
            ['name' => 'Single Pine Bunk Bed',       'category_id' => $beds->id,    'price' => 22000, 'stock' => 8,  'material' => 'Pine Wood',   'dimensions' => '200×90×160 cm',  'description' => 'Sturdy pine bunk bed, perfect for kids rooms. Safety rails included.', 'images' => ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80']],

            // Sofas
            ['name' => '3-Seater Wooden Sofa Set',  'category_id' => $sofas->id,   'price' => 45000, 'stock' => 4,  'material' => 'Sheesham',    'dimensions' => '190×80×90 cm',  'description' => 'Complete 3-seater wooden sofa set with cushions.', 'images' => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80']],
            ['name' => 'L-Shape Corner Sofa',       'category_id' => $sofas->id,   'price' => 65000, 'stock' => 3,  'material' => 'Teak Wood',   'dimensions' => '260×180×85 cm', 'description' => 'Premium L-shape corner sofa with teak frame and premium fabric.', 'images' => ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80']],
            ['name' => 'Wooden Loveseat',           'category_id' => $sofas->id,   'price' => 28000, 'stock' => 7,  'material' => 'Oak Wood',    'dimensions' => '140×75×85 cm',  'description' => 'Cozy 2-seater loveseat with oak frame and removable cushion covers.', 'images' => ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80']],

            // Shelves
            ['name' => '5-Tier Bookshelf',          'category_id' => $shelves->id, 'price' => 12000, 'stock' => 10, 'material' => 'Pine Wood',   'dimensions' => '80×30×180 cm',  'description' => 'Tall 5-tier pine bookshelf with adjustable shelves.', 'images' => ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80']],
            ['name' => 'Floating Wall Shelf Set',   'category_id' => $shelves->id, 'price' => 4500,  'stock' => 20, 'material' => 'Mango Wood',  'dimensions' => '60×20×4 cm',    'description' => 'Set of 3 floating wall shelves in mango wood. Easy to install.', 'images' => ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80']],

            // Decor
            ['name' => 'Carved Wooden Bowl',        'category_id' => $decor->id,   'price' => 1200,  'stock' => 30, 'material' => 'Olive Wood',  'dimensions' => '25×25×10 cm',   'description' => 'Hand-carved olive wood decorative bowl. Each piece is unique.', 'images' => ['https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=600&q=80']],
            ['name' => 'Wooden Photo Frame Set',    'category_id' => $decor->id,   'price' => 2500,  'stock' => 25, 'material' => 'Walnut Wood', 'dimensions' => 'Various sizes',  'description' => 'Set of 3 walnut wood photo frames in different sizes.', 'images' => ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80']],

            // Living Room
            ['name' => 'Sheesham Wood Sofa Set',    'category_id' => $livingRoom->id, 'price' => 52000, 'stock' => 4,  'material' => 'Sheesham',    'dimensions' => '200×85×90 cm',  'description' => 'Premium 3+1+1 sheesham sofa set with cushions. Perfect for your living room.', 'images' => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80']],
            ['name' => 'Teak Wood TV Unit',         'category_id' => $livingRoom->id, 'price' => 18500, 'stock' => 7,  'material' => 'Teak Wood',   'dimensions' => '160×40×55 cm',  'description' => 'Solid teak TV unit with cable management and storage drawers.', 'images' => ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80']],
            ['name' => 'Oak Coffee Table',          'category_id' => $livingRoom->id, 'price' => 11000, 'stock' => 10, 'material' => 'Oak Wood',    'dimensions' => '120×65×45 cm',  'description' => 'Solid oak coffee table with lower shelf. Minimalist design.', 'images' => ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80']],
            ['name' => 'Wooden Display Cabinet',    'category_id' => $livingRoom->id, 'price' => 24000, 'stock' => 5,  'material' => 'Mango Wood',  'dimensions' => '90×40×180 cm',  'description' => 'Elegant display cabinet with glass doors and wooden shelves.', 'images' => ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80']],
            ['name' => 'Wooden Floor Lamp Stand',   'category_id' => $livingRoom->id, 'price' => 4800,  'stock' => 15, 'material' => 'Walnut Wood', 'dimensions' => '30×30×160 cm',  'description' => 'Handcrafted walnut floor lamp stand. Lamp shade not included.', 'images' => ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80']],

            // Bedroom
            ['name' => 'King Teak Bed with Storage','category_id' => $bedroom->id,   'price' => 62000, 'stock' => 3,  'material' => 'Teak Wood',   'dimensions' => '200×180×120 cm', 'description' => 'King size teak bed with hydraulic storage. Carved headboard.', 'images' => ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80']],
            ['name' => 'Sheesham Wardrobe 3-Door',  'category_id' => $bedroom->id,   'price' => 42000, 'stock' => 5,  'material' => 'Sheesham',    'dimensions' => '150×55×200 cm',  'description' => '3-door sheesham wardrobe with mirror and internal shelves.', 'images' => ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80']],
            ['name' => 'Wooden Bedside Table',      'category_id' => $bedroom->id,   'price' => 5500,  'stock' => 20, 'material' => 'Mango Wood',  'dimensions' => '45×40×55 cm',   'description' => 'Compact bedside table with drawer and lower shelf.', 'images' => ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80']],
            ['name' => 'Dressing Table with Mirror','category_id' => $bedroom->id,   'price' => 16000, 'stock' => 8,  'material' => 'Sheesham',    'dimensions' => '100×45×150 cm',  'description' => 'Elegant dressing table with large mirror and 4 drawers.', 'images' => ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80']],
            ['name' => 'Wooden Chest of Drawers',   'category_id' => $bedroom->id,   'price' => 13500, 'stock' => 9,  'material' => 'Oak Wood',    'dimensions' => '80×45×100 cm',   'description' => '5-drawer oak chest with smooth glide runners. Timeless design.', 'images' => ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80']],

            // Office
            ['name' => 'Executive Teak Office Desk','category_id' => $office->id,    'price' => 32000, 'stock' => 5,  'material' => 'Teak Wood',   'dimensions' => '160×75×76 cm',  'description' => 'Large executive desk with 3 drawers and cable management tray.', 'images' => ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80']],
            ['name' => 'Wooden Ergonomic Chair',    'category_id' => $office->id,    'price' => 9800,  'stock' => 12, 'material' => 'Oak Wood',    'dimensions' => '60×60×95 cm',   'description' => 'Ergonomic office chair with solid oak frame and lumbar support cushion.', 'images' => ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80']],
            ['name' => 'Office Bookshelf 4-Tier',   'category_id' => $office->id,    'price' => 8500,  'stock' => 14, 'material' => 'Pine Wood',   'dimensions' => '80×30×150 cm',  'description' => '4-tier pine bookshelf ideal for home office. Easy assembly.', 'images' => ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80']],
            ['name' => 'Compact Writing Desk',      'category_id' => $office->id,    'price' => 7200,  'stock' => 16, 'material' => 'Mango Wood',  'dimensions' => '100×50×75 cm',  'description' => 'Space-saving writing desk with single drawer. Great for small offices.', 'images' => ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80']],
            ['name' => 'Wooden Filing Cabinet',     'category_id' => $office->id,    'price' => 11000, 'stock' => 8,  'material' => 'Sheesham',    'dimensions' => '45×55×70 cm',   'description' => '3-drawer filing cabinet in sheesham wood. Lock included.', 'images' => ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80']],
        ];

        foreach ($products as $p) {
            $slug = Str::slug($p['name']) . '-' . Str::random(4);
            Product::updateOrCreate(
                ['name' => $p['name']],
                array_merge($p, ['slug' => $slug, 'seller_id' => $seller->id, 'is_active' => true])
            );
        }

        $this->command->info(' Wood Kala seeded: admin, seller, customer, 9 categories, 33 products.');
    }
}
