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
  Chip,
} from '@mui/material';
import React, { useState } from 'react';

interface ColorPickerProps {
  colors: Array<{ label: string; value: string }>;
  color: string;
  selectedColorRef?: React.Ref<HTMLDivElement | null>;
  onChange: (value: string) => void;
}

function ColorPicker({ colors, color, onChange, selectedColorRef }: ColorPickerProps) {
  return (
    <ThemeProvider theme={ascentTheme}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(4, 1fr)', // 4 columns on mobile
            sm: 'repeat(5, 1fr)', // 5 columns on small tablets
            md: 'repeat(6, 1fr)', // 6 columns on larger screens
          },
          gap: { xs: 1.5, sm: 1, md: 0.75 },
          padding: { xs: 1.5, sm: 2 },
          justifyItems: 'center',
        }}
      >
        {colors.map(({ label, value }) => {
          const isSelected = label === color;
          const colorValue = (ascentTheme.palette as any)[label]?.main || '#000';

          return (
            <Box
              key={label}
              ref={isSelected ? selectedColorRef : null}
              onClick={() => onChange(value)}
              data-testid={isSelected ? 'selected-color' : null}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                // Larger touch target for mobile
                minWidth: { xs: 56, sm: 48 },
                minHeight: { xs: 72, sm: 64 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // Mobile-friendly tap feedback
                touchAction: 'manipulation',
                '&:active': {
                  transform: 'scale(0.95)',
                },
                '&:hover': {
                  '@media (hover: hover)': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              {/* Color Circle */}
              <Box
                sx={{
                  width: { xs: 48, sm: 44 }, // Larger on mobile
                  height: { xs: 48, sm: 44 },
                  borderRadius: '50%',
                  backgroundColor: colorValue,
                  border: isSelected ? '4px solid #fff' : '3px solid rgba(255,255,255,0.3)',
                  boxShadow: isSelected
                    ? `0 0 0 2px ${colorValue}, 0 4px 12px rgba(0,0,0,0.3)`
                    : '0 2px 6px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  // Ensure minimum touch target size
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 56, sm: 48 }, // 44px minimum for accessibility
                    height: { xs: 56, sm: 48 },
                    borderRadius: '50%',
                    zIndex: -1,
                  },
                }}
              >
                {isSelected && (
                  <Check
                    sx={{
                      color: (ascentTheme.palette as any)[label]?.contrastText || '#fff',
                      fontSize: { xs: 22, sm: 20 }, // Slightly larger on mobile
                      fontWeight: 'bold',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                    }}
                  />
                )}
              </Box>

              {/* Color Label */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: { xs: 0.75, sm: 0.5 },
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.8rem', sm: '0.75rem' }, // Larger text on mobile
                  fontWeight: isSelected ? 600 : 400,
                  textTransform: 'capitalize',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  lineHeight: 1.2,
                  // Prevent text selection on mobile
                  userSelect: 'none',
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </ThemeProvider>
  );
}

function ColorPickerScroller({ colors, color, onChange }: ColorPickerProps) {
  const selectedColorRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    selectedColorRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    });
  }, []);

  return (
    <Box
      sx={{
        maxHeight: '200px',
        overflowY: 'auto',
        borderRadius: 1,
        border: '1px solid rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.05)',

        // Modern scrollbar (Firefox)
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.3) rgba(255,255,255,0.1)',

        // Webkit fallback for older browsers
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.5)',
          },
        },
      }}
    >
      <ColorPicker
        color={color}
        selectedColorRef={selectedColorRef}
        colors={colors}
        onChange={onChange}
      />
    </Box>
  );
}

export default function AscentForm({ slots, slotProps, ascentForm, validationErrors, onCancel }: any) {
  const { form, extras, inputs } = ascentForm;
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const [tries, setTries] = useState(Number(inputs.tries.defaultValue) || 0);
  const [color, setColor] = useState(inputs.color.defaultValue);
  const [completed, setCompleted] = useState(inputs.completed.defaultChecked);
  const [notes, setNotes] = useState(inputs.notes.defaultValue);

  const tagCollection = inputs.tags?.collection || [];
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagCollection
      .filter((tag: any) => tag.defaultChecked)
      .map((tag: any) => tag.value)
  );

  const formId = React.useId();

  const handleTriesDecrement = () => setTries(Math.max(tries - 1, 0));
  const handleTriesIncrement = () => setTries(tries + 1);

  const Content = slots.content || React.Fragment;
  const Actions = slots.actions || React.Fragment;

  const clearForm = () => {
    setTries(0);
    setCompleted(true);
    setNotes('');
    setSelectedTags([]);
  };

  const handleChangeNotes = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleChangeColor = (color: string) => {
    setColor(color);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmitWithFormClear = {
    onSubmit(event: React.FormEvent<HTMLFormElement>) {
      if ('onSubmit' in handleSubmit) {
        handleSubmit.onSubmit(event)
          .then((visitMetaData: any) => {
            if (visitMetaData?.redirected) {
              clearForm();
            }
          });
      }
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
                <Checkbox
                  {...withoutDefaultValues(inputs.completed)}
                  checked={completed}
                  onChange={(event) => setCompleted(event.target.checked)}
                />
              </Box>
            </FieldBase>

            {tagCollection.length > 0 && (
              <FieldBase label="Ascent Type Tags (Optional)" errorKey="tags">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {tagCollection.map((tag: any) => (
                    <React.Fragment key={tag.value}>
                      {selectedTags.includes(tag.value) && (
                        <input
                          type="hidden"
                          name={tag.name}
                          value={tag.value}
                        />
                      )}
                      <Chip
                        label={tag.label}
                        onClick={() => handleToggleTag(tag.value)}
                        color={selectedTags.includes(tag.value) ? 'primary' : 'default'}
                        variant={selectedTags.includes(tag.value) ? 'filled' : 'outlined'}
                        sx={{ cursor: 'pointer' }}
                        data-testid={`ascent-tag-${tag.value}`}
                      />
                    </React.Fragment>
                  ))}
                </Box>
              </FieldBase>
            )}

            <TextArea
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
