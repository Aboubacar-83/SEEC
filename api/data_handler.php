<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

class DataHandler {
    private $dataDir = '../data/';
    
    public function __construct() {
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0755, true);
        }
    }
    
    // Lire les données d'un fichier JSON
    public function readData($filename) {
        $filepath = $this->dataDir . $filename . '.json';
        if (!file_exists($filepath)) {
            return [];
        }
        $data = file_get_contents($filepath);
        return json_decode($data, true) ?: [];
    }
    
    // Écrire les données dans un fichier JSON
    public function writeData($filename, $data) {
        $filepath = $this->dataDir . $filename . '.json';
        $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return file_put_contents($filepath, $jsonData) !== false;
    }
    
    // Obtenir le prochain ID
    public function getNextId($filename) {
        $data = $this->readData($filename);
        if (empty($data)) {
            return 1;
        }
        $maxId = max(array_column($data, 'id'));
        return $maxId + 1;
    }
    
    // Ajouter un nouvel élément
    public function addItem($filename, $item) {
        $data = $this->readData($filename);
        $item['id'] = $this->getNextId($filename);
        $data[] = $item;
        return $this->writeData($filename, $data) ? $item : false;
    }
    
    // Mettre à jour un élément
    public function updateItem($filename, $id, $updatedItem) {
        $data = $this->readData($filename);
        foreach ($data as &$item) {
            if ($item['id'] == $id) {
                $item = array_merge($item, $updatedItem);
                $item['id'] = $id; // Garder l'ID original
                return $this->writeData($filename, $data) ? $item : false;
            }
        }
        return false;
    }
    
    // Supprimer un élément
    public function deleteItem($filename, $id) {
        $data = $this->readData($filename);
        $data = array_filter($data, function($item) use ($id) {
            return $item['id'] != $id;
        });
        return $this->writeData($filename, array_values($data));
    }
    
    // Obtenir un élément par ID
    public function getItemById($filename, $id) {
        $data = $this->readData($filename);
        foreach ($data as $item) {
            if ($item['id'] == $id) {
                return $item;
            }
        }
        return null;
    }
    
    // Obtenir les éléments par critère
    public function getItemsBy($filename, $field, $value) {
        $data = $this->readData($filename);
        return array_filter($data, function($item) use ($field, $value) {
            return $item[$field] == $value;
        });
    }
}

// Gestion des requêtes
$handler = new DataHandler();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$filename = $_GET['file'] ?? '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'get' && $filename) {
                $data = $handler->readData($filename);
                echo json_encode(['success' => true, 'data' => $data]);
            } elseif ($action === 'getById' && $filename && isset($_GET['id'])) {
                $item = $handler->getItemById($filename, $_GET['id']);
                echo json_encode(['success' => true, 'data' => $item]);
            } elseif ($action === 'getBy' && $filename && isset($_GET['field']) && isset($_GET['value'])) {
                $items = $handler->getItemsBy($filename, $_GET['field'], $_GET['value']);
                echo json_encode(['success' => true, 'data' => array_values($items)]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Action non reconnue']);
            }
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if ($action === 'add' && $filename && $input) {
                $result = $handler->addItem($filename, $input);
                if ($result) {
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'ajout']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'Données manquantes']);
            }
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            if ($action === 'update' && $filename && isset($_GET['id']) && $input) {
                $result = $handler->updateItem($filename, $_GET['id'], $input);
                if ($result) {
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Erreur lors de la mise à jour']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'Données manquantes']);
            }
            break;
            
        case 'DELETE':
            if ($action === 'delete' && $filename && isset($_GET['id'])) {
                $result = $handler->deleteItem($filename, $_GET['id']);
                if ($result) {
                    echo json_encode(['success' => true, 'message' => 'Élément supprimé']);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Erreur lors de la suppression']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'ID manquant']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'error' => 'Méthode non supportée']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?> 