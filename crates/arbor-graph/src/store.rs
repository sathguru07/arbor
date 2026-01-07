use crate::graph::ArborGraph;
use sled::Db;
use std::path::Path;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum StoreError {
    #[error("Database error: {0}")]
    Sled(#[from] sled::Error),
    #[error("Serialization error: {0}")]
    Bincode(#[from] bincode::Error),
}

pub struct GraphStore {
    db: Db,
}

impl GraphStore {
    /// Opens or creates a graph store at the specified path.
    pub fn open<P: AsRef<Path>>(path: P) -> Result<Self, StoreError> {
        let db = sled::open(path)?;
        Ok(Self { db })
    }

    /// Saves the entire graph to the store.
    ///
    /// The graph is serialized using bincode and stored under a fixed key "main_graph".
    pub fn save_graph(&self, graph: &ArborGraph) -> Result<(), StoreError> {
        let bytes = bincode::serialize(graph)?;
        self.db.insert("main_graph", bytes)?;
        self.db.flush()?;
        Ok(())
    }

    /// Loads the graph from the store.
    pub fn load_graph(&self) -> Result<Option<ArborGraph>, StoreError> {
        if let Some(bytes) = self.db.get("main_graph")? {
            let graph: ArborGraph = bincode::deserialize(&bytes)?;
            Ok(Some(graph))
        } else {
            Ok(None)
        }
    }

    /// Clears the stored graph.
    pub fn clear(&self) -> Result<(), StoreError> {
        self.db.remove("main_graph")?;
        self.db.flush()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_save_load_graph() {
        let dir = tempdir().unwrap();
        let store = GraphStore::open(dir.path()).unwrap();

        let mut graph = ArborGraph::new();
        // Add some data? Graph is empty by default but that's valid.

        store.save_graph(&graph).unwrap();

        let loaded = store.load_graph().unwrap().unwrap();
        assert_eq!(loaded.node_count(), 0);
    }
}
