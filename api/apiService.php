<?php
include_once 'ConnectionDB.php';
// if (!$_GET['cors']){
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: X-Requested-With');
    header('Access-Control-Allow-Methods: POST, GET');
    header('Content-Type: application/json');
    header('Accept: application/json');
// }

//$data = json_decode(file_get_contents("php://input"));

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$model = $_GET['model'] ?? $_POST['model'] ?? '';


switch ($action) {
    case 'get':
        $select = $_GET['select'] ?? $_POST['select'] ?? 0;
        $join = $_GET['join'] ?? $_POST['join'] ?? 0;
        $where = $_GET['where'] ?? $_POST['where'] ?? 0;
        $orderBy = $_GET['orderBy'] ?? $_POST['orderBy'] ?? 0;
        $orderHow = $_GET['orderHow'] ?? $_POST['orderHow'] ?? 0;
        $offset = (int) ($_GET['offset'] ?? $_POST['offset'] ?? 0);
        $page = (int) ($_GET['page'] ?? $_POST['page'] ?? 0);
        $response = ConnectionDB::select($select, $model, $join, $where, $orderBy, $orderHow, $offset, $page);
        break;
    case 'getOne':
        $id = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);
        $response = ConnectionDB::selectOne($model, $id);
        break;
    case 'getNum':
        $response = ConnectionDB::getTotalRegister($model);
        break;
    case 'getTotalExpenses':
        $response = ConnectionDB::getTotalExpenses();
        break;
    case 'add':
        if ($model === 'expenses') {
            $date = $_GET['date'] ?? $_POST['date'] ?? '';
            $quantity = $_GET['quantity'] ?? $_POST['quantity'] ?? '';
            $description = $_GET['description'] ?? $_POST['description'] ?? '';
            $category = $_GET['category'] ?? $_POST['category'] ?? '';
            $response = ConnectionDB::insert($model, ['date','quantity','description','category'], 
            [$date,$quantity,$description,$category]);
        } elseif ($model === 'categories') {
            $name = $_GET['name'] ?? $_POST['name'] ?? '';
            $description = $_GET['description'] ?? $_POST['description'] ?? '';
            $response = ConnectionDB::insert($model, ['name','description'], [$name,$description]);
        } else {
            $response = 'error';
        }
        break;
    case 'update':
        if ($model === 'expenses') {
            $where = $_POST['where'] ?? $_GET['where'] ?? '';
            $date = $_GET['date'] ?? $_POST['date'] ?? '';
            $quantity = $_GET['quantity'] ?? $_POST['quantity'] ?? '';
            $description = $_GET['description'] ?? $_POST['description'] ?? '';
            $category = $_GET['category'] ?? $_POST['category'] ?? '';
            $response = ConnectionDB::update($model, 
            ['date'=>$date,'quantity'=>$quantity,'description'=>$description,'category'=>$category], $where);
        } elseif ($model === 'categories') {
            $where = $_POST['where'] ?? $_GET['where'] ?? 0;
            $name = $_POST['name'] ?? $_GET['name'] ?? 0;
            $description = $_GET['description'] ?? $_POST['description'] ?? '';
            $response = ConnectionDB::update($model, 
            ['name'=>$name,'description'=>$description], $where);
        } else {
            $response = 'error';
        }
        break;
    case 'delete':
        $id = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);
        $response = ConnectionDB::delete($model, "id LIKE $id");
        break;
    default:
        $response = 'Invalid action';
}

echo json_encode($response);
