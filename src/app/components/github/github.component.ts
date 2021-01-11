import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit {
  userProfile: any;
  users: any;
  editar: boolean = false;

  gitHubForm: FormGroup;
  exibirBotaoGitHub: boolean = true;
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.gitHubForm = this.fb.group({
      id: this.fb.control('', []),
      user: this.fb.control('', [Validators.required]),
      avatar_url: this.fb.control('', [Validators.required]),
      nome: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      cidade: this.fb.control('', [Validators.required]),
      formacao: this.fb.control('', [Validators.required]),
      tecnologias: this.fb.control('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.getAllUsers();

    this.activatedRoute.queryParams.subscribe(
      (params) => {
        if (params.code) {
          this.exibirBotaoGitHub = false;
          this.http.post('http://127.0.0.1:3000/token/gettoken/', { code: params.code }).subscribe(
            (res) => {
              this.userProfile = res;
              this.gitHubForm.get('user').setValue(this.userProfile.login);
              this.gitHubForm.get('avatar_url').setValue(this.userProfile.avatar_url);
              this.gitHubForm.get('email').setValue(this.userProfile.email);
              this.gitHubForm.get('nome').setValue(this.userProfile.name);
              this.exibirBotaoGitHub = true;
            },
            (err) => {
              console.log('errorrr', err)
            }
          );

          //clear params in url
          if (params && Object.keys(params).length > 0) {
            const urlWithoutQueryParams = this.router.url.substring(0, this.router.url.indexOf('?'));
            this.router.navigateByUrl(urlWithoutQueryParams)
              .then(() => {
                params = null;
              });
          }
        }
      }
    )
  }

  getAllUsers() {
    this.http.get('http://127.0.0.1:3000/user').subscribe(
      (res) => {
        this.users = res;
      },
      (err) => {
        console.log('erro ao trazer os usuários', err)
      }
    )
  }

  cadastrarGitHub() {
    let body = {
      user: this.gitHubForm.value.user,
      avatar_url: this.gitHubForm.value.avatar_url,
      nome: this.gitHubForm.value.nome,
      email: this.gitHubForm.value.email,
      cidade: this.gitHubForm.value.cidade,
      formacao: this.gitHubForm.value.formacao,
      tecnologias: this.gitHubForm.value.tecnologias,
    }

    if (this.editar) {
      this.editar = false;
      this.http.patch('http://127.0.0.1:3000/user/' + this.gitHubForm.value.id, body).subscribe(
        (res) => {
          this.gitHubForm.reset();
          alert('Usuário Editdado com Sucesso!!!');
          this.getAllUsers();
        },
        (err) => {
          console.log('errorrr', err);
          alert('Erro ao Editar o Usuário');
        }
      )


    }
    else {
      this.http.post('http://127.0.0.1:3000/user', body).subscribe(
        (res) => {
          this.gitHubForm.reset();
          alert('Usuário Cadastrado com Sucesso!!!');
          this.getAllUsers();
        },
        (err) => {
          console.log('errorrr', err);
          alert('Erro ao Cadastrar o Usuário');
        }
      )
    }
  }

  getLink(user) {
    let _user = "https://github.com/" + user;
    return _user
  }


  editCadastro(user) {
    this.gitHubForm.reset();
    this.editar = true;
    this.gitHubForm.get('id').setValue(user._id);
    this.gitHubForm.get('user').setValue(user.user);
    this.gitHubForm.get('avatar_url').setValue(user.avatar_url);
    this.gitHubForm.get('nome').setValue(user.nome);
    this.gitHubForm.get('email').setValue(user.email);
    this.gitHubForm.get('cidade').setValue(user.cidade);
    this.gitHubForm.get('formacao').setValue(user.formacao);
    this.gitHubForm.get('tecnologias').setValue(user.tecnologias);
  }

  deleteCadastro(id){
    this.http.delete('http://127.0.0.1:3000/user/' + id).subscribe(
        (res) => {
          this.gitHubForm.reset();
          alert('Usuário Deletado com Sucesso!!!');
          this.getAllUsers();
        },
        (err) => {
          console.log('errorrr', err);
          alert('Erro ao Deletar o Usuário');
        }
      )
    }
}
