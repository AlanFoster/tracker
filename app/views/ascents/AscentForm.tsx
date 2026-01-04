import type { SelectChangeEvent } from '@mui/material';
import { ascentTheme } from '@javascript/applications/main/components/ascentColors';
import { Checkbox, FieldBase, Form, SubmitButton, TextArea, withoutDefaultValues } from '@javascript/components/Inputs';
import useVisitFormSubmit from '@javascript/components/useVisitFormSubmit';
import { Check } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  IconButton,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

interface ColorPickerProps {
  colors: string[];
  color: string;
  selectedColorRef?: React.Ref<HTMLLIElement | null>;
  onChange: (value: string) => void;
}

function ColorPicker({ colors, color, onChange, selectedColorRef }: ColorPickerProps) {
  return (
    <ThemeProvider theme={ascentTheme}>
      <ul style={{ paddingLeft: '9px', paddingRight: '14px', listStyle: 'none' }}>
        {colors.map(({ label, value }) => (
          <li
            key={label}
            style={{ marginBottom: '1rem' }}
            ref={(label === color) ? selectedColorRef : null}
          >
            <Button
              type="button"
              variant="contained"
              color={label}
              style={{
                width: '100%',
              }}
              onClick={() => onChange(value)}
              endIcon={label === color ? <Check /> : null}
              data-testid={label === color ? 'selected-color' : null}
            >
              {label}
            </Button>
          </li>
        ))}
      </ul>
    </ThemeProvider>
  );
}

function ColorPickerScroller({ colors, color, onChange }: ColorPickerProps) {
  const selectedColorRef = React.useRef<HTMLLIElement | null>(null);

  React.useEffect(() => {
    selectedColorRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    });
  }, []);

  return (
    <Box
      sx={{
        maxHeight: '19rem',
        overflowY: 'scroll',
      }}
    >
      <ColorPicker
        color={color}
        selectedColorRef={selectedColorRef}
        colors={colors}
        onChange={onChange}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '2rem',
          background: 'linear-gradient(to bottom, transparent, rgba(57,57,57,1))',
          pointerEvents: 'none',
        }}
      >
      </Box>
    </Box>
  );
}

export default function AscentForm({ slots, slotProps, ascentForm, validationErrors, onCancel }) {
  const { form, extras, inputs } = ascentForm;
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const [tries, setTries] = useState(Number(inputs.tries.defaultValue) || 0);
  const [color, setColor] = useState(inputs.color.defaultValue);
  const [completed, setCompleted] = useState(inputs.completed.defaultChecked);
  const [notes, setNotes] = useState(inputs.notes.defaultValue);
  const formId = React.useId();

  const handleTriesDecrement = () => setTries(Math.max(tries - 1, 0));
  const handleTriesIncrement = () => setTries(tries + 1);

  const Content = slots.content || React.Fragment;
  const Actions = slots.actions || React.Fragment;

  const clearForm = () => {
    setTries(0);
    setCompleted(true);
    setNotes('');
  };

  const handleChangeCompleted = (event: SelectChangeEvent) => {
    setCompleted(event.target.checked);
  };

  const handleChangeNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleChangeColor = (color: string) => {
    setColor(color);
  };

  const handleSubmitWithFormClear = {
    onSubmit(event: React.FormEvent<HTMLFormElement>) {
      handleSubmit.onSubmit(event)
        .then((visitMetaData) => {
          if (visitMetaData.redirected) {
            clearForm();
          }
        });
    },
  };

  return (
    <>
      <Content {...slotProps.content}>
        <Form
          {...form}
          id={formId}
          extras={extras}
          validationErrors={validationErrors}
          {...handleSubmitWithFormClear}
        >
          <Stack spacing={1}>

            {/* Color picker */}
            <Box sx={{ marginBottom: '1rem' }}>
              <input
                type="hidden"
                id={inputs.color.id}
                name={inputs.color.name}
                value={color}
              />
              <FieldBase fullWidth {...inputs.color} label="Color" errorKey="color">
                <ColorPickerScroller
                  color={color}
                  colors={inputs.color.options}
                  onChange={handleChangeColor}
                />
              </FieldBase>
            </Box>

            {/* Tries picker */}
            <Box>
              <input
                type="hidden"
                id={inputs.tries.id}
                name={inputs.tries.name}
                value={tries}
              />
              <FieldBase fullWidth {...inputs.tries} label="Tries" errorKey="tries">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    onClick={handleTriesDecrement}
                    color="primary"
                    aria-label="Decrease"
                    disabled={tries <= 0}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Box textAlign="center">
                    <Typography variant="body1" minWidth="5rem">
                      {tries === 0 ? 'flash' : tries.toString()}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={handleTriesIncrement}
                    color="primary"
                    aria-label="Increase"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </FieldBase>
            </Box>

            {/* Completed? */}
            <FieldBase {...withoutDefaultValues(inputs.completed)} label="Topped?" errorKey="completed">
              <Box>
                <Checkbox {...withoutDefaultValues(inputs.completed)} checked={completed} onChange={handleChangeCompleted} />
              </Box>
            </FieldBase>

            <TextArea
              fullWidth
              rows={4}
              {...withoutDefaultValues(inputs.notes)}
              label="Notes (Optional)"
              errorKey="notes"
              onChange={handleChangeNotes}
              value={notes}
            />
          </Stack>
        </Form>
      </Content>

      <Actions {...slotProps.actions}>
        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 1 }}>
          <SubmitButton fullWidth variant="contained" {...inputs.submit} loading={isLoading} form={formId} />
          {onCancel && (
            <Button fullWidth variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </Actions>
    </>
  );
}
