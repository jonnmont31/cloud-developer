import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import {
  createAlbum,
  deleteAlbum,
  getAlbums,
  patchAlbum
} from '../api/albums-api'
import Auth from '../auth/Auth'
import { Album } from '../types/Album'

interface AlbumsProps {
  auth: Auth
  history: History
}

interface AlbumsState {
  albums: Album[]
  albumName: string
  albumArtist: string
  albumYear: string
  albumGenre: string
  loadingAlbums: boolean
}

export class Albums extends React.PureComponent<AlbumsProps, AlbumsState> {
  state: AlbumsState = {
    albums: [],
    albumName: '',
    albumArtist: '',
    albumYear: '',
    albumGenre: '',
    loadingAlbums: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumName: event.target.value })
  }

  handleArtistChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumArtist: event.target.value })
  }

  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumYear: event.target.value })
  }

  handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ albumGenre: event.target.value })
  }

  onAlbumEditButtonClick = (albumId: string) => {
    this.props.history.push(`/albums/${albumId}/edit`)
  }

  onAlbumCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      if (this.state.albumName.replace(/\s/g, '').length) {
        const newAlbum = await createAlbum(this.props.auth.getIdToken(), {
          albumName: this.state.albumName,
          albumArtist: this.state.albumArtist,
          year: this.state.albumYear,
          genre: this.state.albumGenre
        })
        this.setState({
          albums: [...this.state.albums, newAlbum],
          albumName: '',
          albumArtist: '',
          albumYear: '',
          albumGenre: ''
        })
      } else {
        alert('Album Name cannot be empty')
      }
    } catch {
      alert('Album creation failed')
    }
  }

  onAlbumDelete = async (albumId: string) => {
    try {
      await deleteAlbum(this.props.auth.getIdToken(), albumId)
      this.setState({
        albums: this.state.albums.filter((album) => album.albumId !== albumId)
      })
    } catch {
      alert('Album deletion failed')
    }
  }

  onAlbumCheck = async (pos: number) => {
    try {
      const album = this.state.albums[pos]
      await patchAlbum(this.props.auth.getIdToken(), album.albumId, {
        albumName: album.albumName,
        albumArtist: album.albumArtist,
        albumYear: album.albumYear,
        albumGenre: album.albumGenre
      })
    } catch {
      alert('Album deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const albums = await getAlbums(this.props.auth.getIdToken())
      this.setState({
        albums,
        loadingAlbums: false
      })
    } catch (e) {
      alert(`Failed to fetch albums: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Music Vault</Header>
        {this.renderAlbumForm()}
        {this.renderAlbums()}
      </div>
    )
  }

  renderAlbumForm() {
    return (
      <Form onSubmit={this.onAlbumCreate}>
        <Form.Field>
          <label>Album Title</label>
          <input
            onChange={this.handleNameChange}
            placeholder="e.g. A Night At The Opera"
          />
        </Form.Field>
        <Form.Field>
          <label>Album Artist</label>
          <input onChange={this.handleArtistChange} placeholder="e.g. Queen" />
        </Form.Field>
        <Form.Field>
          <label>Year</label>
          <input onChange={this.handleYearChange} placeholder="e.g. 1975" />
        </Form.Field>
        <Form.Field>
          <label>Genre</label>
          <input
            onChange={this.handleGenreChange}
            placeholder="e.g. Glam-Rock"
          />
        </Form.Field>
        <Button color="teal" type="submit" icon>
          Add Album
        </Button>
      </Form>
    )
  }

  renderAlbums() {
    if (this.state.loadingAlbums) {
      return this.renderLoading()
    }

    return this.renderAlbumsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Albums
        </Loader>
      </Grid.Row>
    )
  }

  renderAlbumsList() {
    return (
      <Grid padded>
        {this.state.albums.map((album, pos) => {
          return (
            <Grid.Row key={album.albumId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column> */}
              <Grid.Column width={10} verticalAlign="middle">
                {album.albumName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {album.albumArtist}
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
