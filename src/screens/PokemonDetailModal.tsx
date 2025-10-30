import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Descriptions, Modal, Spin } from 'antd';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { tss } from '../tss';

export const PokemonDetailModal = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useGetPokemonDetails(Number(id));

  if (loading || !data)
    return (
      <div className={classes.loading}>
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div className={classes.error}>
        <Alert type="error" message="Failed to load details" showIcon />
      </div>
    );

  const { name, sprite, types, height, weight, captureRate, stats } = data;

  const formattedStats = stats?.length
    ? stats.map((s: any) => `${s.name}: ${s.value}`).join(' • ')
    : '—';

  return (
    <Modal
      open
      centered
      width={680}
      title={name ? `${name} #${id}` : `Pokémon #${id}`}
      onCancel={() => navigate('/list')}
      footer={null}
      destroyOnClose
      className={classes.modal}
    >
      <div className={classes.detailsContainer}>
        {sprite && <img src={sprite} alt={name} width={220} className={classes.sprite} />}
        <Descriptions column={1} bordered size="middle" className={classes.descriptions}>
          <Descriptions.Item label="Name">{name}</Descriptions.Item>
          <Descriptions.Item label="Types">{types?.join(' • ') || 'Unknown'}</Descriptions.Item>
          <Descriptions.Item label="Height">{height ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Weight">{weight ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Capture Rate">{captureRate ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Stats">{formattedStats}</Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

const useStyles = tss.create(() => ({
  modal: {
    '& .ant-modal-content': {
      borderRadius: '16px',
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '240px',
    width: '100%',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '240px',
    width: '100%',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    marginTop: 16,
    marginBottom: 16,
  },
  sprite: {
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
    background: 'transparent',
    marginBottom: 8,
    maxWidth: 220,
    width: '100%',
  },
  descriptions: {
    minWidth: '320px',
    maxWidth: '420px',
    width: '100%',
    background: 'transparent',
    '& .ant-descriptions-bordered .ant-descriptions-item-label': {
      fontWeight: 500,
      background: 'rgba(250,250,250,0.95)',
    },
    '& .ant-descriptions-bordered .ant-descriptions-item-content': {
      background: 'rgba(255,255,255,0.9)',
    },
  },
}));
