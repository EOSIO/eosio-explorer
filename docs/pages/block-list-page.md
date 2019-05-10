[Home](..) > Block List Page

# Block List Page

The block list page contains a visualization of the blocks being produced by the currently running `nodeos` instance. It will show up to a maximum of the latest **100** produced blocks. 

Optionally, you can choose to change the number of blocks to display on this list to 10, 20 or 50 blocks at the bottom of this page.

## Block List

A panel containing a dynamic table which continuously updates by polling the MongoDB instance for blocks produced by the currently running `nodeos` instance. Each row on this list contains the following information:
* Block number
* Block ID
* Number of transactions
* Timestamp of production

Each row is clickable, which will take you to the associated [Block Detail Page](./detail-pages/block-detail-page.md)
of the block. You can also choose to filter out the empty blocks in the list, and display only non-empty blocks. You may also search for a block by typing the block number or block ID into the search box and clicking search.

### Filter by Empty or Non-empty Blocks

By clicking the checkbox labeled "No empty blocks," you can choose to display only the blocks which contain transactions. The default behavior is to display all blocks, including empty ones (unchecked filter). The list will refresh to match the filter and will persist in future sessions.

### Block Search

On the upper right corner of the Block List panel, you can choose to directly search for a produced block either through its block number or its block ID if you know it. Type it into the search box and click "Search." If the block is found, you will be taken to its associated [Block Detail Page](./detail-pages/block-detail-page.md) otherwise you will be shown a page indicating that the block was not found.
