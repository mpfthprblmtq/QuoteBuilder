import React, {FunctionComponent, useState} from "react";
import {Box, Button, CircularProgress, TextField, Tooltip} from "@mui/material";
import {green} from "@mui/material/colors";
import {SetNameStyledTypography} from "../../Main/MainComponent.styles";
import {Item} from "../../../model/item/Item";
import {generateId} from "../../../utils/ArrayUtils";
import {Clear, Reorder} from "@mui/icons-material";
import {StyledCard} from "../Cards.styles";
import {AxiosError} from "axios";
import {useItemLookupService} from "../../../services/useItemLookupService";
import BulkLoadDialog from "../../Dialog/BulkLoadDialog/BulkLoadDialog";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const [setNumber, setSetNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [bulkLoadModalOpen, setBulkLoadModalOpen] = useState<boolean>(false);

    const { getHydratedItem } = useItemLookupService();

    /**
     * Main search method that searches for a set and sets all appropriate values
     */
    const searchForSet = async () => {
        setLoading(true);
        setError('');
        await getHydratedItem(setNumber)
            .then((item: Item) => {
                setLoading(false);
                setError('');

                // set the id
                item.id = generateId(items);

                // add the item with sales data to existing state
                setItems([...items, item]);

                // update graphics
                setLoading(false);
                setSetNumber('');

            }).catch((error: AxiosError) => {
                console.error(error);
                setLoading(false);
                if (error.response?.status === 404) {
                    setError(`Item not found: ${setNumber}`);
                } else {
                    setError("Issue with BrickLink service!");
                }
            });
    };

    const addToItems = (itemsToAdd: Item[]) => {
        let nextId = generateId(items);
        itemsToAdd.forEach(item => {
            // set the id
            item.id = nextId;
            nextId++;
        });

        setItems([...items, ...itemsToAdd]);
    }

    return (
        <StyledCard variant="outlined" sx={{minWidth: 400}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <form>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <TextField
                            label={'Item ID'}
                            variant="outlined"
                            sx={{backgroundColor: "white"}}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSetNumber(event.target.value);
                            }}
                            value={setNumber}
                        />
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button
                            variant="contained"
                            disabled={loading || !setNumber}
                            onClick={searchForSet}
                            style={{minWidth: "100px", height: "50px"}}
                            type='submit'>
                            Search
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={loading || !setNumber}
                            onClick={() => {
                                setSetNumber('');
                                setError('');
                            }}
                            style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px"}}>
                            <Clear />
                        </Button>
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Tooltip title={'Bulk Load Items'}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setBulkLoadModalOpen(true);
                                }}
                                style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px"}}>
                                <Reorder />
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </form>
            <Box>
                {error &&
                    <SetNameStyledTypography color={"red"}>{error}</SetNameStyledTypography>}
            </Box>
            <BulkLoadDialog
                open={bulkLoadModalOpen}
                onClose={() => setBulkLoadModalOpen(false)}
                addToItems={addToItems} />
        </StyledCard>
    )
};

export default ItemSearchCard;