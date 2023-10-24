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
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  createAlbum
} from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import { Album } from '../types/Album'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  albums: Album[]
  todos: Todo[]
  newTodoName: string
  albumName: string
  albumArtist: string
  albumYear: string
  albumGenre: string
  loadingTodos: boolean
  loadingAlbums: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    albums: [],
    todos: [],
    newTodoName: '',
    albumName: '',
    albumArtist: '',
    albumYear: '',
    albumGenre: '',
    loadingTodos: true,
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

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onAlbumEditButtonClick = (albumId: string) => {
    this.props.history.push(`/albums/${albumId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      if (this.state.newTodoName.replace(/\s/g, '').length) {
        const dueDate = this.calculateDueDate()

        const newTodo = await createTodo(this.props.auth.getIdToken(), {
          name: this.state.newTodoName,
          dueDate
        })
        this.setState({
          todos: [...this.state.todos, newTodo],
          newTodoName: ''
        })
      } else {
        alert('Todo cannot be empty')
      }
    } catch {
      alert('Todo creation failed')
    }
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

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter((todo) => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Music Vault</Header>

        {this.renderCreateTodoInput()}
        {this.renderAlbumForm()}
        {this.renderTodos()}
        {this.renderAlbumsList()}
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

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Album',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
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

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
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
